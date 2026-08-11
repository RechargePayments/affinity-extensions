// ─── CSS setup ───────────────────────────────────────────────────────────────
// Paste the contents of AFF_CSS from css-constants.js (repo root) here.
// Alternative: host skills/affinity-framework/assets/aff-framework.css on your
// own CDN and inject it as a <link> tag instead. See skills/affinity-framework/SKILL.md.
const AFF_CSS = ``;

// Paste the contents of TW_CSS from css-constants.js here (optional —
// only needed if you use tw: layout classes, which this extension does).
const TW_CSS = ``;

// ─── Config ───────────────────────────────────────────────────────────────────
// Any variant ID belonging to the product you want to offer.
// When SHOW_VARIANT_SELECTOR is false this variant is always used.
const DEFAULT_VARIANT_ID    = 'YOUR_VARIANT_ID'; // CUSTOMIZE: any variant ID from the target product

// Pre-selected purchase type. Used directly when SHOW_PLAN_SELECTOR is false.
// 'onetime' | 'subscription'
const DEFAULT_PLAN          = 'onetime'; // CUSTOMIZE: 'onetime' or 'subscription'

// Set false to lock the widget to DEFAULT_VARIANT_ID without showing a selector.
const SHOW_VARIANT_SELECTOR = true; // CUSTOMIZE: false to hide the variant selector

// Set false to lock the widget to DEFAULT_PLAN without showing a selector.
// The plan selector is also suppressed automatically when no subscription plan exists.
const SHOW_PLAN_SELECTOR    = true; // CUSTOMIZE: false to hide the delivery frequency selector

// Copy shown above the product card.
const INTRO_HEADING         = 'Add to next order'; // CUSTOMIZE: heading text
const INTRO_BODY            = 'Enhance your upcoming shipment with a one-time item.'; // CUSTOMIZE: body text

// null  → use the first two sentences from the product's body_html
// string → shown verbatim (2-line clamp with ellipsis still applies)
const PRODUCT_DESCRIPTION   = null; // CUSTOMIZE: override with a string or leave null

// ─── Tag ─────────────────────────────────────────────────────────────────────
const TAG_NAME = 'rc-product-offer';

// ─── Internal constants ───────────────────────────────────────────────────────
const SDK_URL = 'https://static.rechargecdn.com/assets/storefront/recharge-client-1.81.0.min.js';

const COMPONENT_CSS = `
  rc-product-offer {
    container-type: inline-size;
    display: block;
  }

  @container (min-width: 480px) {
    .offer-layout {
      display: grid;
      grid-template-columns: 35fr 65fr;
      gap: 24px;
      align-items: start;
    }
  }

  .offer-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: offerSpin 0.7s linear infinite;
    vertical-align: middle;
    flex-shrink: 0;
  }

  @keyframes offerSpin { to { transform: rotate(360deg); } }

  .aff-radio-option input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

class ProductOffer extends HTMLElement {
  #session           = null;
  #addressId         = null;
  #nextChargeDate    = null;
  #product           = null;
  #selectedVariantId = DEFAULT_VARIANT_ID;
  #selectedPlan      = DEFAULT_PLAN;
  #state             = 'idle'; // idle | loading | error
  #errorMessage      = '';

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

    if (!document.querySelector('#rc-product-offer-css')) {
      const s = document.createElement('style');
      s.id = 'rc-product-offer-css';
      s.textContent = COMPONENT_CSS;
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
      window.recharge.init({ appName: TAG_NAME });
    }
    const rc = window.recharge;
    return {
      loginCustomerPortal: ()                      => rc.auth.loginCustomerPortal(),
      listCharges:         (session, params)       => rc.charge.listCharges(session, params),
      createOnetime:       (session, params, opts) => rc.onetime.createOnetime(session, params, opts),
      createSubscription:  (session, params, opts) => rc.subscription.createSubscription(session, params, opts),
      productSearch:       (session, params)       => rc.product.productSearch(session, params),
    };
  }

  async _init() {
    try {
      const { loginCustomerPortal, listCharges, productSearch } = await this._loadSdk();
      this.#session = await loginCustomerPortal();

      const [chargeResult, productResult] = await Promise.all([
        listCharges(this.#session, { status: 'queued', sort_by: 'scheduled_at-asc', limit: 1 }),
        productSearch(this.#session, { external_variant_ids: [DEFAULT_VARIANT_ID], format_version: '2022-06' }),
      ]);

      const nextCharge = chargeResult?.charges?.[0];
      if (!nextCharge?.scheduled_at) throw new Error('No upcoming charge found to attach this item to.');

      this.#addressId      = nextCharge.address_id;
      this.#nextChargeDate = nextCharge.scheduled_at;

      const prod = productResult?.products?.[0];
      if (!prod) throw new Error('Product not found.');

      // Build a flat plans array: one entry per plan, with a human label and sub params.
      // Sorted: onetime first, then subscriptions by frequency ascending.
      const allPlans = (prod.plans ?? [])
        .filter(p => p.type === 'onetime' || (p.type === 'subscription' && p.subscription_preferences?.charge_interval_frequency))
        .sort((a, b) => {
          if (a.type === 'onetime') return -1;
          if (b.type === 'onetime') return 1;
          return (a.subscription_preferences.charge_interval_frequency ?? 0)
               - (b.subscription_preferences.charge_interval_frequency ?? 0);
        })
        .map(p => {
          if (p.type === 'onetime') {
            return { id: String(p.id), type: 'onetime', label: 'One-time', subParams: null };
          }
          const freq   = p.subscription_preferences.charge_interval_frequency;
          const unit   = p.subscription_preferences.interval_unit ?? 'month';
          const plural = freq == 1 ? unit : `${unit}s`;
          return {
            id:        String(p.id),
            type:      'subscription',
            label:     `${freq} ${plural}`,
            subParams: {
              charge_interval_frequency: freq,
              order_interval_unit:       unit,
              order_interval_frequency:  p.subscription_preferences.order_interval_frequency ?? freq,
            },
          };
        });

      // Normalise options: [{ name, values }] — supports both object and string shapes,
      // and handles values that may themselves be objects rather than plain strings.
      const options = (prod.options ?? []).map(opt => {
        const name    = typeof opt === 'string' ? opt : (opt.name ?? 'Option');
        const rawVals = typeof opt === 'string' ? [] : (opt.values ?? []);
        const values  = rawVals.map(v =>
          typeof v === 'string' ? v : (v.value ?? v.label ?? v.title ?? String(v))
        );
        return { name, values };
      });

      // Variant ID is v.external_variant_id (string). Prices keyed by plan ID.
      // optionValues splits the variant title so each option position can be tracked.
      const variants = (prod.variants ?? []).map(v => {
        const planPrices  = v.prices?.[0]?.plans ?? [];
        const basePrice   = v.prices?.[0]?.unit_price ?? null;
        const prices      = {};
        for (const plan of allPlans) {
          const match     = planPrices.find(p => String(p.id) === plan.id);
          prices[plan.id] = match?.discounted_price ?? basePrice;
        }
        return {
          id:           String(v.external_variant_id ?? ''),
          title:        v.title ?? 'Default',
          optionValues: (v.title ?? '').split(' / '),
          imageUrl:     v.image?.large ?? null,
          prices,
        };
      });

      // Set the initial selected plan ID based on DEFAULT_PLAN.
      const defaultPlanObj = DEFAULT_PLAN === 'subscription'
        ? allPlans.find(p => p.type === 'subscription')
        : allPlans.find(p => p.type === 'onetime');
      if (defaultPlanObj) this.#selectedPlan = defaultPlanObj.id;

      // Build description from prod.description (HTML) unless the config overrides it.
      let description = PRODUCT_DESCRIPTION;
      if (!description && prod.description) {
        const text      = prod.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
        description     = sentences.slice(0, 2).join(' ').trim() || text.slice(0, 160);
      }

      this.#product = {
        title:       prod.title ?? 'Product',
        description: description ?? null,
        imageUrl:    prod.images?.[0]?.large ?? null,
        options,
        variants,
        plans:       allPlans,
      };

      // Hide silently if any variant of this product is already in the upcoming charge.
      const chargeVariantIds  = new Set(
        (nextCharge.line_items ?? []).map(li => String(li.external_variant_id?.ecommerce ?? '')),
      );
      const productVariantIds = new Set(variants.map(v => v.id));
      const alreadyInCharge   = [...chargeVariantIds].some(id => productVariantIds.has(id));
      if (alreadyInCharge) {
        this.style.display = 'none';
        return;
      }

      this._render();
    } catch (err) {
      this.#state        = 'error';
      this.#errorMessage = err?.message ?? 'Failed to load account data.';
      this._render();
    }
  }

  async _handleAdd() {
    if (this.#state === 'loading') return;
    this.#state = 'loading';
    this._render();

    try {
      const sdk          = await this._loadSdk();
      const selectedPlan = this.#product.plans.find(p => p.id === this.#selectedPlan);

      if (selectedPlan?.type === 'subscription') {
        const sub = selectedPlan.subParams;
        if (!sub) throw new Error('Subscription plan details are not available for this product.');

        await sdk.createSubscription(this.#session, {
          address_id:                this.#addressId,
          external_variant_id:       { ecommerce: this.#selectedVariantId },
          quantity:                  1,
          next_charge_scheduled_at:  this.#nextChargeDate,
          charge_interval_frequency: sub.charge_interval_frequency,
          order_interval_unit:       sub.order_interval_unit,
          order_interval_frequency:  sub.order_interval_frequency,
        }, { commit: true });

        this.style.display = 'none';
        document.dispatchEvent(new CustomEvent('Affinity:refresh'));
      } else {
        await sdk.createOnetime(this.#session, {
          address_id:               this.#addressId,
          next_charge_scheduled_at: this.#nextChargeDate,
          quantity:                 1,
          external_variant_id:      { ecommerce: this.#selectedVariantId },
        });

        this.style.display = 'none';
        document.dispatchEvent(new CustomEvent('Affinity:refresh'));
      }
    } catch (err) {
      this.#state        = 'error';
      this.#errorMessage = err?.message ?? 'Something went wrong. Please try again.';
      this._render();
    }
  }

  _handleRetry() {
    this.#state        = 'idle';
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
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">
            <path d="m10.423 5.577-4.846 4.846M5.577 5.577l4.846 4.846M8 15.429A7.429 7.429 0 1 0 8 .57 7.429 7.429 0 0 0 8 15.43Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
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

    const isLoading   = this.#state === 'loading';
    const isError     = this.#state === 'error';
    const btnDisabled = isLoading ? 'disabled' : '';

    const selectedVariant = this.#product.variants.find(v => v.id === this.#selectedVariantId)
                         ?? this.#product.variants[0];

    const selectedPlanObj = this.#product.plans.find(p => p.id === this.#selectedPlan);
    const onetimePlanId   = this.#product.plans.find(p => p.type === 'onetime')?.id;
    const rawPrice        = selectedVariant?.prices?.[this.#selectedPlan] ?? null;
    const rawCompare      = (
      selectedPlanObj?.type === 'subscription' &&
      onetimePlanId &&
      selectedVariant?.prices?.[onetimePlanId] &&
      parseFloat(rawPrice) < parseFloat(selectedVariant.prices[onetimePlanId])
    ) ? selectedVariant.prices[onetimePlanId] : null;

    const price     = this._formatPrice(rawPrice);
    const compareAt = this._formatPrice(rawCompare);
    const title     = this._escapeHtml(this.#product.title ?? '');
    const desc      = this.#product.description ? this._escapeHtml(this.#product.description) : null;
    const imageUrl  = selectedVariant?.imageUrl ?? this.#product.imageUrl;

    const imgHtml = imageUrl
      ? `<img class="aff-img" src="${this._escapeHtml(imageUrl)}" alt="${title}" style="width:100%;aspect-ratio:1/1;object-fit:cover;" />`
      : `<div style="width:100%;aspect-ratio:1/1;background:var(--recharge-color-neutral-95);border-radius:calc(var(--recharge-corners-radius)/2);"></div>`;

    // ── Variant selectors — one per option (e.g. Size, Color) ─────────────────
    const showVariants      = SHOW_VARIANT_SELECTOR && this.#product.variants.length > 1;
    const selectedOptValues = selectedVariant?.optionValues ?? [];
    const variantPills = showVariants ? this.#product.options.map((opt, optIdx) => `
      <div class="tw:flex tw:flex-col tw:gap-1">
        <p class="aff-text-body aff-text-sm aff-text-muted">${this._escapeHtml(opt.name)}</p>
        <div class="tw:flex tw:flex-wrap tw:gap-2">
          ${opt.values.map(val => `
            <label class="aff-radio-option">
              <input type="radio" name="offer-opt-${optIdx}" data-opt-idx="${optIdx}"
                     value="${this._escapeHtml(val)}"
                     ${selectedOptValues[optIdx] === val ? 'checked' : ''} />
              <span class="aff-text-body aff-text-sm">${this._escapeHtml(val)}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('') : '';

    // ── Plan selector (radio pills) ────────────────────────────────────────────
    const showPlans = SHOW_PLAN_SELECTOR && this.#product.plans.length > 1;
    const planPills = showPlans ? `
      <div class="tw:flex tw:flex-col tw:gap-1">
        <p class="aff-text-body aff-text-sm aff-text-muted">Delivery frequency</p>
        <div class="tw:flex tw:flex-wrap tw:gap-2">
          ${this.#product.plans.map(plan => `
            <label class="aff-radio-option">
              <input type="radio" name="offer-plan" value="${this._escapeHtml(plan.id)}"
                     ${plan.id === this.#selectedPlan ? 'checked' : ''} />
              <span class="aff-text-body aff-text-sm">${this._escapeHtml(plan.label)}</span>
            </label>
          `).join('')}
        </div>
      </div>
    ` : '';

    // ── Price display ──────────────────────────────────────────────────────────
    const priceHtml = compareAt ? `
      <p class="aff-text-body aff-text-base">
        <span class="aff-text-muted" style="text-decoration:line-through">${compareAt}</span>&nbsp;${price}
      </p>
    ` : price ? `
      <p class="aff-text-body aff-text-base">${price}</p>
    ` : '';

    // Preserve the existing image node to avoid a reload flicker when only
    // the plan (not the variant) changes and the image URL is unchanged.
    const prevImg    = this.querySelector('img.aff-img');
    const prevImgSrc = prevImg?.getAttribute('src') ?? null;

    this.innerHTML = `
      <div class="tw:flex tw:flex-col tw:gap-4">

        <div class="tw:flex tw:flex-col tw:gap-1">
          <h2 class="aff-h2 aff-text-heading">${this._escapeHtml(INTRO_HEADING)}</h2>
          <p class="aff-text-body aff-text-sm">${this._escapeHtml(INTRO_BODY)}</p>
        </div>

        <div class="offer-layout tw:flex tw:flex-col tw:gap-4">

          <div>${imgHtml}</div>

          <div class="tw:flex tw:flex-col tw:gap-3">

            <div class="tw:flex tw:flex-col tw:gap-1">
              ${title ? `<h3 class="aff-h1 aff-text-heading">${title}</h3>` : ''}
              ${desc  ? `<p class="aff-text-body aff-text-sm tw:line-clamp-2">${desc}</p>` : ''}
            </div>

            ${variantPills}
            ${planPills}

            <div class="tw:flex tw:flex-col tw:gap-2">
              ${priceHtml}
              <div>
                <button class="recharge-button aff-btn aff-btn-primary tw:flex tw:items-center tw:gap-2"
                        id="add-btn" ${btnDisabled}>
                  ${isLoading ? '<span class="offer-spinner" aria-hidden="true"></span> Adding\u2026' : 'Add to order'}
                </button>
              </div>
            </div>

          </div>
        </div>

        ${isError ? `
          <div class="aff-alert aff-alert-error" role="alert">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">
              <path d="m10.423 5.577-4.846 4.846M5.577 5.577l4.846 4.846M8 15.429A7.429 7.429 0 1 0 8 .57 7.429 7.429 0 0 0 8 15.43Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="aff-text-body aff-text-sm">${this._escapeHtml(this.#errorMessage)}</p>
          </div>
          <button class="recharge-button aff-btn aff-btn-secondary" id="retry-btn">Try again</button>
        ` : ''}

      </div>
    `;

    if (prevImg && prevImgSrc) {
      const newImg = this.querySelector('img.aff-img');
      if (newImg && newImg.getAttribute('src') === prevImgSrc) {
        newImg.replaceWith(prevImg);
      }
    }

    this.querySelector('#add-btn')?.addEventListener('click', () => this._handleAdd());
    this.querySelector('#retry-btn')?.addEventListener('click', () => this._handleRetry());

    this.#product.options.forEach((_, optIdx) => {
      this.querySelectorAll(`input[name="offer-opt-${optIdx}"]`).forEach(radio => {
        radio.addEventListener('change', e => {
          const current = (
            this.#product.variants.find(v => v.id === this.#selectedVariantId)
            ?? this.#product.variants[0]
          )?.optionValues?.slice() ?? [];
          current[optIdx] = e.currentTarget.value;
          const match = this.#product.variants.find(v =>
            v.optionValues.every((val, i) => val === current[i])
          );
          if (match) this.#selectedVariantId = match.id;
          this._render();
        });
      });
    });

    this.querySelectorAll('input[name="offer-plan"]').forEach(radio => {
      radio.addEventListener('change', e => {
        this.#selectedPlan = e.currentTarget.value;
        this._render();
      });
    });
  }

  _escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  refresh() {
    this.style.display      = '';
    this.#state             = 'idle';
    this.#selectedVariantId = DEFAULT_VARIANT_ID;
    this.#selectedPlan      = DEFAULT_PLAN;
    this.#addressId         = null;
    this.#nextChargeDate    = null;
    this.#product           = null;
    this._render();
    this._init();
  }
}

customElements.define(TAG_NAME, ProductOffer);
export default ProductOffer;
