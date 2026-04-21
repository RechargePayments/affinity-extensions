// ─── CSS setup ───────────────────────────────────────────────────────────────
// Paste the contents of AFF_CSS from css-constants.js (repo root) here.
// Alternative: host .skills/affinity-framework/assets/aff-framework.css on your own CDN and
// inject it as a <link> tag instead. See .skills/affinity-framework/SKILL.md for both patterns.
const AFF_CSS = ``;

// Paste the contents of TW_CSS from css-constants.js here (optional —
// only needed if you use tw: layout classes, which this extension does).
const TW_CSS = ``;

// ─── Configure these for your store ──────────────────────────────────────────
// The Shopify variant ID of the product to offer as a one-time addition.
// The extension hides itself automatically if the item is already in the
// customer's next charge, so it's safe to show it on every portal visit.
const VARIANT_ID = 'YOUR_VARIANT_ID';

const SDK_URL = 'https://static.rechargecdn.com/assets/storefront/recharge-client-1.81.0.min.js';

class AddOnetime extends HTMLElement {
  #session = null;
  #addressId = null;
  #nextChargeDate = null;
  #product = null; // { title, imageUrl, price }
  #state = 'idle'; // idle | loading | success | error
  #errorMessage = '';

  connectedCallback() {
    if (!document.querySelector('#aff-framework')) {
      const s = document.createElement('style');
      s.id = 'aff-framework';
      s.textContent = AFF_CSS;
      document.head.appendChild(s);
    }

    if (!document.querySelector('#tw-css')) {
      const s = document.createElement('style');
      s.id = 'tw-css';
      s.textContent = TW_CSS;
      document.head.appendChild(s);
    }

    this._render();
    this._init();
  }

  async _loadSdk() {
    if (!window.recharge) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = SDK_URL;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Failed to load Recharge SDK'));
        document.head.appendChild(s);
      });
      window.recharge.init({ appName: 'rc-add-onetime' });
    }
    const rc = window.recharge;
    return {
      loginCustomerPortal: () => rc.auth.loginCustomerPortal(),
      listCharges: (session, params) => rc.charge.listCharges(session, params),
      createOnetime: (session, params, opts) => rc.onetime.createOnetime(session, params, opts),
      productSearch: (session, params) => rc.product.productSearch(session, params),
    };
  }

  async _init() {
    try {
      const { loginCustomerPortal, listCharges, productSearch } = await this._loadSdk();
      this.#session = await loginCustomerPortal();

      const [chargeResult, productResult] = await Promise.all([
        listCharges(this.#session, { status: 'queued', sort_by: 'scheduled_at-asc', limit: 1 }),
        productSearch(this.#session, { external_variant_ids: [VARIANT_ID], format_version: '2022-06' }),
      ]);

      const nextCharge = chargeResult?.charges?.[0];
      if (!nextCharge?.scheduled_at) throw new Error('No upcoming charge found to attach this item to.');

      const alreadyInOrder = (nextCharge.line_items ?? []).some(
        (li) => li.external_variant_id?.ecommerce === VARIANT_ID,
      );
      if (alreadyInOrder) {
        this.style.display = 'none';
        return;
      }

      this.#addressId = nextCharge.address_id;
      this.#nextChargeDate = nextCharge.scheduled_at;

      const prod = productResult?.products?.[0];
      const variant = prod?.variants?.[0];
      this.#product = {
        title: prod?.title ?? 'Product',
        imageUrl: prod?.images?.[0]?.medium ?? null,
        price: variant?.prices?.[0]?.unit_price ?? null,
      };

      this._render();
    } catch (err) {
      this.#state = 'error';
      this.#errorMessage = err?.message ?? 'Failed to load account data.';
      this._render();
    }
  }

  async _handleAdd() {
    if (this.#state === 'loading') return;
    this.#state = 'loading';
    this._render();

    try {
      const { createOnetime } = await this._loadSdk();
      await createOnetime(this.#session, {
        address_id: this.#addressId,
        next_charge_scheduled_at: this.#nextChargeDate,
        quantity: 1,
        external_variant_id: { ecommerce: VARIANT_ID },
      }, { commit: true });
      this.style.display = 'none';
      document.dispatchEvent(new CustomEvent('Affinity:refresh'));
      return;
    } catch (err) {
      this.#state = 'error';
      this.#errorMessage = err?.message ?? 'Something went wrong. Please try again.';
    }

    this._render();
  }

  _handleRetry() {
    this.#state = 'idle';
    this.#errorMessage = '';
    this._render();
    this._init();
  }

  _formatPrice(raw) {
    if (!raw) return null;
    const n = parseFloat(raw);
    return isNaN(n) ? null : `$${n.toFixed(2)}`;
  }

  _formatDate(iso) {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return iso;
    }
  }

  _render() {
    if (this.#state === 'error' && !this.#product) {
      this.innerHTML = `
        <div style="display:flex;align-items:flex-start;gap:8px;background:#fce8e6;color:#b31412;border-radius:6px;padding:10px 12px;">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:1px;">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 5v3.5M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span style="font-size:13px;">${this._escapeHtml(this.#errorMessage)}</span>
        </div>
        <button class="recharge-button aff-btn aff-btn-secondary" id="retry-btn" style="margin-top:8px;">Try again</button>
      `;
      this.querySelector('#retry-btn')?.addEventListener('click', () => this._handleRetry());
      return;
    }

    if (!this.#product) {
      this.innerHTML = '';
      return;
    }

    const isLoading = this.#state === 'loading';
    const isError = this.#state === 'error';
    const btnDisabled = isLoading ? 'disabled' : '';

    const price = this._formatPrice(this.#product?.price);
    const chargeDate = this._formatDate(this.#nextChargeDate);
    const title = this._escapeHtml(this.#product?.title ?? '');
    const imageUrl = this.#product?.imageUrl;

    const imgHtml = imageUrl
      ? `<img class="aff-img" src="${this._escapeHtml(imageUrl)}" alt="${title}" style="aspect-ratio:1/1;object-fit:cover;width:100%;" />`
      : `<div style="aspect-ratio:1/1;width:100%;background:var(--recharge-color-neutral-95);border-radius:calc(var(--recharge-corners-radius)/2);"></div>`;

    this.innerHTML = `
      <style>
        rc-add-onetime .aff-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          display: inline-block;
          animation: affSpin 0.7s linear infinite;
          vertical-align: middle;
          flex-shrink: 0;
        }
        @keyframes affSpin { to { transform: rotate(360deg); } }
      </style>

      <div class="tw:flex tw:flex-col tw:gap-2">

        <div class="tw:flex tw:flex-col tw:gap-1">
          <h2 class="aff-h2 aff-text-heading">Add to next order</h2>
          <p class="aff-text-body aff-text-base">Enhance your upcoming shipment with a one-time item.</p>
        </div>

        <div class="tw:grid tw:grid-cols-3 tw:gap-5 tw:items-center tw:mt-2">
          <div class="tw:col-span-1">${imgHtml}</div>
          <div class="tw:col-span-2 tw:flex tw:flex-col tw:gap-2">
            ${title ? `<h1 class="aff-h1 aff-text-heading">${title}</h1>` : ''}
            ${chargeDate ? `<p class="aff-text-body aff-text-sm">One-time addition to your ${chargeDate} order.</p>` : ''}
            ${price ? `<p class="aff-text-body aff-text-base">${price}</p>` : ''}
            <div class="tw:pt-2">
              <button class="recharge-button aff-btn aff-btn-primary tw:flex tw:items-center tw:gap-2" id="add-btn" ${btnDisabled}>
                ${isLoading ? '<span class="aff-spinner" aria-hidden="true"></span> Adding…' : 'Add to order'}
              </button>
            </div>
          </div>
        </div>

        ${isError ? `
          <div class="tw:flex tw:items-start tw:gap-2" style="background:#fce8e6;color:#b31412;border-radius:calc(var(--recharge-corners-radius)/2);padding:10px 12px;">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;margin-top:1px;">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 5v3.5M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="aff-text-body aff-text-sm">${this._escapeHtml(this.#errorMessage)}</span>
          </div>
          <button class="recharge-button aff-btn aff-btn-secondary" id="retry-btn">Try again</button>
        ` : ''}

      </div>
    `;

    this.querySelector('#add-btn')?.addEventListener('click', () => this._handleAdd());
    this.querySelector('#retry-btn')?.addEventListener('click', () => this._handleRetry());
  }

  _escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  refresh() {
    this.style.display = '';
    this.#state = 'idle';
    this.#addressId = null;
    this.#nextChargeDate = null;
    this.#product = null;
    this._render();
    this._init();
  }
}

customElements.define('rc-add-onetime', AddOnetime);
export default AddOnetime;
