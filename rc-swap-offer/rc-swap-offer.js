// ─── CSS setup ───────────────────────────────────────────────────────────────
// Paste the contents of AFF_CSS from css-constants.js (repo root) here.
// Alternative: host skills/affinity-framework/assets/aff-framework.css on your own CDN and
// inject it as a <link> tag instead. See skills/affinity-framework/SKILL.md for both patterns.
const AFF_CSS = ``;

// Paste the contents of TW_CSS from css-constants.js here (optional —
// only needed if you use tw: layout classes, which this extension does).
const TW_CSS = ``;

// ─── Configure these for your store ──────────────────────────────────────────
// The extension shows only to customers who have an active subscription on
// SOURCE_PRODUCT_ID but are NOT already on TARGET_VARIANT_ID.
// When they click the CTA, their subscription variant is updated immediately.

// Shopify product ID of the subscription the customer is currently on.
const SOURCE_PRODUCT_ID = 'YOUR_SOURCE_PRODUCT_ID';

// Shopify variant ID to swap the subscription to.
const TARGET_VARIANT_ID = 'YOUR_TARGET_VARIANT_ID';

const SDK_URL = 'https://static.rechargecdn.com/assets/storefront/recharge-client-1.81.0.min.js';

class SwapOffer extends HTMLElement {
  #session = null;
  #subscriptionId = null;
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
      window.recharge.init({ appName: 'rc-swap-offer' });
    }
    const rc = window.recharge;
    return {
      loginCustomerPortal: () => rc.auth.loginCustomerPortal(),
      listSubscriptions: (session, params) => rc.subscription.listSubscriptions(session, params),
      updateSubscription: (session, id, params, opts) => rc.subscription.updateSubscription(session, id, params, opts),
      productSearch: (session, params) => rc.product.productSearch(session, params),
    };
  }

  async _init() {
    try {
      const { loginCustomerPortal, listSubscriptions, productSearch } = await this._loadSdk();
      this.#session = await loginCustomerPortal();

      const result = await listSubscriptions(this.#session, { status: 'active' });
      const subscriptions = result?.subscriptions ?? [];

      const match = subscriptions.find(
        (sub) => sub.external_product_id?.ecommerce === SOURCE_PRODUCT_ID &&
          sub.external_variant_id?.ecommerce !== TARGET_VARIANT_ID,
      );

      if (!match) {
        this.style.display = 'none';
        return;
      }

      this.#subscriptionId = match.id;

      const productResult = await productSearch(this.#session, {
        external_variant_ids: [TARGET_VARIANT_ID],
        format_version: '2022-06',
      });

      const prod = productResult?.products?.[0];
      const variant = prod?.variants?.find(v => v.external_variant_id === TARGET_VARIANT_ID)
        ?? prod?.variants?.[0];
      this.#product = {
        title: variant?.title ?? prod?.title ?? 'Product',
        imageUrl: variant?.image?.medium ?? prod?.images?.[0]?.medium ?? null,
        price: variant?.prices?.[0]?.unit_price ?? null,
      };

      this._render();
    } catch (err) {
      this.#state = 'error';
      this.#errorMessage = err?.message ?? 'Failed to load account data.';
      this._render();
    }
  }

  async _handleSwap() {
    if (this.#state === 'loading') return;
    this.#state = 'loading';
    this._render();

    try {
      const { updateSubscription } = await this._loadSdk();
      await updateSubscription(this.#session, this.#subscriptionId, {
        external_variant_id: { ecommerce: TARGET_VARIANT_ID },
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

  _render() {
    if (this.#state === 'error' && !this.#product) {
      this.innerHTML = `
        <div class="aff-alert aff-alert-error" role="alert">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="m10.423 5.577-4.846 4.846M5.577 5.577l4.846 4.846M8 15.429A7.429 7.429 0 1 0 8 .57 7.429 7.429 0 0 0 8 15.43Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <p class="aff-text-body aff-text-sm">${this._escapeHtml(this.#errorMessage)}</p>
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
    const title = this._escapeHtml(this.#product?.title ?? '');
    const imageUrl = this.#product?.imageUrl;

    const imgHtml = imageUrl
      ? `<img class="aff-img tw:aspect-square tw:object-cover tw:w-full" src="${this._escapeHtml(imageUrl)}" alt="${title}" />`
      : `<div class="aff-img tw:aspect-square tw:w-full" style="background:var(--recharge-color-neutral-95);"></div>`;

    this.innerHTML = `
      <style>
        rc-swap-offer .swap-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          display: inline-block;
          animation: swapSpin 0.7s linear infinite;
          vertical-align: middle;
          flex-shrink: 0;
        }
        @keyframes swapSpin { to { transform: rotate(360deg); } }
      </style>

      <div class="tw:grid tw:grid-cols-3 tw:gap-5 tw:items-center">
        <div class="tw:col-span-2 tw:flex tw:flex-col tw:gap-2">
          <!-- CUSTOMIZE: update badge text, heading, body copy, and button label to match your offer -->
          <span class="aff-badge tw:self-start" style="background-color:var(--recharge-button-secondary);color:var(--recharge-typography-light);font-weight:600;">NEW</span>
          <h2 class="aff-h2 aff-text-heading">New variant available</h2>
          <p class="aff-text-body aff-text-sm">Switch your subscription to ${title} in one click.</p>
          ${price ? `<p class="aff-text-body aff-text-sm">${price} per shipment</p>` : ''}
          ${isError ? `
            <div class="aff-alert aff-alert-error" role="alert">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="m10.423 5.577-4.846 4.846M5.577 5.577l4.846 4.846M8 15.429A7.429 7.429 0 1 0 8 .57 7.429 7.429 0 0 0 8 15.43Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <p class="aff-text-body aff-text-sm">${this._escapeHtml(this.#errorMessage)}</p>
            </div>
          ` : ''}
          <div class="tw:pt-2">
            <!-- CUSTOMIZE: update button label -->
            <button class="recharge-button aff-btn aff-btn-primary" id="swap-btn" ${btnDisabled}>
              ${isLoading ? '<span class="swap-spinner" aria-hidden="true"></span> Switching…' : `Switch to ${title}`}
            </button>
            ${isError ? `<button class="recharge-button aff-btn aff-btn-secondary" id="retry-btn" style="margin-top:8px;">Try again</button>` : ''}
          </div>
        </div>
        <div class="tw:col-span-1">
          ${imgHtml}
        </div>
      </div>
    `;

    this.querySelector('#swap-btn')?.addEventListener('click', () => this._handleSwap());
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
    this.#subscriptionId = null;
    this.#product = null;
    this._render();
    this._init();
  }
}

customElements.define('rc-swap-offer', SwapOffer);
export default SwapOffer;
