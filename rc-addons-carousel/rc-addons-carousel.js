// ─── CSS setup ───────────────────────────────────────────────────────────────
// Paste the contents of AFF_CSS from css-constants.js (repo root) here.
const AFF_CSS = ``;
// Paste the contents of TW_CSS from css-constants.js here (optional).
const TW_CSS = ``;

// ─── Configure these for your store ──────────────────────────────────────────

// CUSTOMIZE: Card width in pixels.
const CARD_W = 168;
// CUSTOMIZE: Gap between cards in pixels.
const CARD_GAP = 12;
// CUSTOMIZE: Heading shown above the carousel.
const HEADING = 'Add something extra to your next order';

const TAG_NAME = 'rc-addons-carousel';
const STEP = CARD_W + CARD_GAP;
const SDK_URL = 'https://static.rechargecdn.com/assets/storefront/recharge-client-1.81.0.min.js';

const ARROW_PREV = '<path d="M7 1L1 7L7 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
const ARROW_NEXT = '<path d="M1 1L7 7L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';

const STYLES = `
  ${TAG_NAME} .ac-stack { display: flex; flex-direction: column; gap: 12px; }
  ${TAG_NAME} .ac-field { display: flex; flex-direction: column; gap: 4px; }
  ${TAG_NAME} .ac-heading {
    font-size: 17px; font-weight: 700; line-height: 1.3;
    color: var(--recharge-typography-primary, #1a1a1a);
    margin: 0;
  }
  ${TAG_NAME} .ac-label {
    font-size: 12px; font-weight: 600; letter-spacing: 0.02em;
    color: var(--recharge-typography-muted, #8c7f74);
    margin: 0;
  }
  ${TAG_NAME} .ac-select {
    width: 100%; box-sizing: border-box;
    padding: 7px 10px;
    border: 1px solid var(--recharge-color-border, #e0dbd5);
    border-radius: var(--recharge-corners-radius, 8px);
    font-size: 14px; font-family: inherit;
    background: #fff;
    color: var(--recharge-typography-primary, #3c352d);
    outline: none; cursor: pointer;
  }
  ${TAG_NAME} .ac-select:focus { border-color: var(--recharge-button-brand, #1773b0); }
  ${TAG_NAME} .ac-search-wrap {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 10px;
    border: 1px solid var(--recharge-color-border, #e0dbd5);
    border-radius: var(--recharge-corners-radius, 8px);
    background: #fff;
    box-sizing: border-box;
  }
  ${TAG_NAME} .ac-search-wrap:focus-within { border-color: var(--recharge-button-brand, #1773b0); }
  ${TAG_NAME} .ac-search-icon { flex-shrink: 0; display: flex; line-height: 0; color: #8c7f74; }
  ${TAG_NAME} .ac-search {
    flex: 1; min-width: 0;
    border: none !important; outline: none !important;
    padding: 0 !important; margin: 0 !important;
    background: transparent !important;
    font-size: 13px; font-family: inherit; line-height: 1.4;
    color: var(--recharge-typography-primary, #3c352d);
    box-shadow: none !important;
  }
  ${TAG_NAME} .ac-search::placeholder { color: var(--recharge-typography-muted, #aaa); }
  ${TAG_NAME} .ac-track-wrap { position: relative; display: flex; align-items: center; gap: 6px; }
  ${TAG_NAME} .ac-track {
    display: flex; gap: ${CARD_GAP}px;
    overflow-x: auto; scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none; -ms-overflow-style: none;
    padding: 4px 0;
    flex: 1;
  }
  ${TAG_NAME} .ac-track::-webkit-scrollbar { display: none; }
  ${TAG_NAME} .ac-arrow {
    flex-shrink: 0;
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 1px solid var(--recharge-color-border, #e0dbd5);
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: var(--recharge-typography-primary, #3c352d);
    transition: opacity 0.15s ease, background 0.15s ease;
  }
  ${TAG_NAME} .ac-arrow:disabled { opacity: 0.3; cursor: default; }
  ${TAG_NAME} .ac-arrow:not(:disabled):hover { background: var(--recharge-color-neutral-20, #f5f5f5); }
  ${TAG_NAME} .ac-card {
    flex-shrink: 0; width: ${CARD_W}px;
    scroll-snap-align: start;
    display: flex; flex-direction: column; gap: 5px;
    background: #fff;
    border: 1px solid var(--recharge-color-border, #e8e3de);
    border-radius: var(--recharge-corners-radius, 8px);
    padding: 10px;
    box-sizing: border-box;
  }
  ${TAG_NAME} .ac-card-img {
    width: 100%; aspect-ratio: 1/1;
    object-fit: cover; display: block;
    border-radius: calc(var(--recharge-corners-radius, 8px) / 2);
  }
  ${TAG_NAME} .ac-card-img-empty { background: var(--recharge-color-neutral-20, #f0ece8); }
  ${TAG_NAME} .ac-card-title {
    font-size: 12px; font-weight: 600; line-height: 1.3;
    color: var(--recharge-typography-primary, #1a1a1a);
    margin: 3px 0 0;
  }
  ${TAG_NAME} .ac-card-variant { font-size: 11px; color: var(--recharge-typography-muted, #8c7f74); line-height: 1.3; }
  ${TAG_NAME} .ac-card-price { font-size: 12px; color: var(--recharge-typography-primary, #1a1a1a); line-height: 1.3; }
  ${TAG_NAME} .ac-card-price s { color: var(--recharge-typography-muted, #aaa); margin-right: 3px; }
  ${TAG_NAME} .ac-card-spacer { flex: 1; min-height: 4px; }
  ${TAG_NAME} .ac-card-btn {
    width: 100%; padding: 6px 8px;
    font-size: 12px; font-weight: 600; font-family: inherit;
    border: none; border-radius: calc(var(--recharge-corners-radius, 8px) / 2);
    cursor: pointer;
    background: var(--recharge-button-brand, #1773b0);
    color: #fff;
    transition: opacity 0.15s ease;
  }
  ${TAG_NAME} .ac-card-btn:disabled { opacity: 0.55; cursor: default; }
  ${TAG_NAME} .ac-card-btn:not(:disabled):hover { opacity: 0.85; }
  ${TAG_NAME} .ac-retry { width: auto; align-self: flex-start; }
  ${TAG_NAME} .ac-error {
    font-size: 13px; color: #b31412; background: #fce8e6;
    padding: 10px 12px; border-radius: 6px; margin: 0;
  }
  ${TAG_NAME} .ac-empty { font-size: 13px; color: var(--recharge-typography-muted, #8c7f74); padding: 12px 0; }
  @keyframes acShimmer {
    0%   { background-position: -300px 0; }
    100% { background-position:  300px 0; }
  }
  ${TAG_NAME} .ac-skel {
    border-radius: 4px;
    background: linear-gradient(90deg, #ececec 25%, #e0e0e0 50%, #ececec 75%);
    background-size: 600px 100%;
    animation: acShimmer 1.4s infinite linear;
  }
  ${TAG_NAME} .ac-skel-heading  { height: 18px; width: 75%; }
  ${TAG_NAME} .ac-skel-search   { height: 32px; width: 100%; }
  ${TAG_NAME} .ac-skel-img      { width: 100%; aspect-ratio: 1/1; border-radius: calc(var(--recharge-corners-radius, 8px) / 2); }
  ${TAG_NAME} .ac-skel-title    { height: 12px; width: 85%; margin-top: 6px; }
  ${TAG_NAME} .ac-skel-subtitle { height: 10px; width: 60%; }
  ${TAG_NAME} .ac-skel-price    { height: 10px; width: 70%; }
  ${TAG_NAME} .ac-skel-btn      { height: 26px; width: 100%; border-radius: calc(var(--recharge-corners-radius, 8px) / 2); }
  ${TAG_NAME} .ac-skeleton-card { border-color: transparent; }
  ${TAG_NAME} .ac-track-wrap-skeleton .ac-track { pointer-events: none; }
`;

function injectStyle(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}

// the SDK returns variant ids either as a raw value or as { ecommerce }
function variantIdOf(raw) {
  if (!raw) return '';
  return String(typeof raw === 'object' ? (raw.ecommerce ?? '') : raw);
}

function cleanVariantTitle(title) {
  return title === 'Default Title' ? '' : (title ?? '');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

function priceHtml(price, compareAt) {
  const unit    = price     ? parseFloat(price)     : null;
  const compare = compareAt ? parseFloat(compareAt) : null;
  if (unit === null) return '';
  if (compare !== null && compare > unit) {
    return `<p class="ac-card-price"><s>$${compare.toFixed(2)}</s> $${unit.toFixed(2)}</p>`;
  }
  return `<p class="ac-card-price">$${unit.toFixed(2)}</p>`;
}

function buttonLabel(status) {
  if (status === 'added') return 'Added ✓';
  if (status === 'adding') return 'Adding…';
  return 'Add';
}

class AddonsCarousel extends HTMLElement {
  #session = null;
  #state = 'idle'; // idle | loading | error
  #errorMessage = '';
  #nextCharge = null;
  #parents = []; // [{ sub, products }]
  #selectedIdx = 0;
  #adding = new Set();
  #added = new Set(); // `${parentSubId}:${variantId}`
  #searchQuery = '';

  get #parent() { return this.#parents[this.#selectedIdx] ?? null; }

  _key(variantId) { return `${this.#parent?.sub.id}:${variantId}`; }

  connectedCallback() {
    injectStyle('aff-framework', AFF_CSS);
    injectStyle('tw-css', TW_CSS);
    injectStyle(`${TAG_NAME}-css`, STYLES);
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
      loginCustomerPortal: () => rc.auth.loginCustomerPortal(),
      listCharges:         (session, params)       => rc.charge.listCharges(session, params),
      listSubscriptions:   (session, params)       => rc.subscription.listSubscriptions(session, params),
      createSubscription:  (session, params, opts) => rc.subscription.createSubscription(session, params, opts),
      productSearch:       (session, params)       => rc.product.productSearch(session, params),
    };
  }

  async _init() {
    this.#state = 'loading';
    this._render();
    try {
      const { loginCustomerPortal, listCharges, listSubscriptions } = await this._loadSdk();
      this.#session = await loginCustomerPortal();

      const [chargeResult, subResult] = await Promise.all([
        listCharges(this.#session, { status: 'queued', sort_by: 'scheduled_at-asc', limit: 1 }),
        listSubscriptions(this.#session, { status: 'active' }),
      ]);

      const charge = chargeResult?.charges?.[0];
      if (!charge) return this._hide('no queued charge');
      this.#nextCharge = { address_id: charge.address_id, scheduled_at: charge.scheduled_at };

      const subs = subResult?.subscriptions ?? [];
      const onCharge = new Set((charge.line_items ?? []).map(li => String(li.purchase_item_id)));
      const children = subs.filter(s => s.addon_parent_subscription_id);
      for (const child of children) {
        this.#added.add(`${child.addon_parent_subscription_id}:${variantIdOf(child.external_variant_id)}`);
      }

      // standalone and parent subs look identical, so a sub is a parent only if it has add-ons to offer
      const candidates = subs.filter(s => !s.addon_parent_subscription_id && onCharge.has(String(s.id)));
      const results = await Promise.all(candidates.map(async sub => ({ sub, products: await this._fetchProducts(sub) })));
      this.#parents = results.filter(p => p.products.length);
      if (!this.#parents.length) return this._hide('no parent subscriptions on upcoming order');

      this.#state = 'idle';
      this._render();
    } catch (err) {
      console.error(`[${TAG_NAME}] init error`, err);
      this.#state = 'error';
      this.#errorMessage = err?.message ?? 'Failed to load add-ons.';
      this._render();
    }
  }

  _hide(reason) {
    console.warn(`[${TAG_NAME}] ${reason}, hiding`);
    this.style.display = 'none';
  }

  async _fetchProducts(sub) {
    const vid = variantIdOf(sub.external_variant_id);
    if (!vid) return [];
    const { productSearch } = await this._loadSdk();
    const result = await productSearch(this.#session, {
      has_addon_plans:             true,
      parent_external_variant_ids: [vid],
      format_version:              '2022-06',
      limit:                       250,
    });
    return this._normalizeProducts(result?.products ?? []);
  }

  _normalizeProducts(products) {
    return products.map(prod => {
      const variant = prod.variants?.[0];
      return {
        variantId:    variantIdOf(variant?.external_variant_id),
        title:        prod.title ?? '',
        variantTitle: cleanVariantTitle(variant?.title),
        image:        prod.images?.[0]?.medium ?? '',
        price:        variant?.prices?.[0]?.unit_price ?? null,
        compareAt:    variant?.compare_at_price ?? variant?.prices?.[0]?.compare_at_price ?? null,
      };
    }).filter(p => p.variantId);
  }

  _filteredProducts() {
    const products = this.#parent?.products ?? [];
    const q = this.#searchQuery.toLowerCase();
    if (!q) return products;
    return products.filter(p =>
      p.title.toLowerCase().includes(q) || p.variantTitle.toLowerCase().includes(q)
    );
  }

  _statusOf(variantId) {
    const key = this._key(variantId);
    if (this.#added.has(key)) return 'added';
    if (this.#adding.has(key)) return 'adding';
    return 'idle';
  }

  _handleParentChange(idx) {
    this.#selectedIdx = idx;
    this._renderCarouselArea();
  }

  _handleSearch(query) {
    this.#searchQuery = query;
    this._renderCarouselArea();
  }

  async _handleAdd(variantId) {
    if (this._statusOf(variantId) !== 'idle') return;

    const { sub } = this.#parent;
    const key = this._key(variantId);
    this.#adding.add(key);
    this._updateCardButton(variantId);

    try {
      const { createSubscription } = await this._loadSdk();
      await createSubscription(this.#session, {
        address_id:                   this.#nextCharge.address_id,
        next_charge_scheduled_at:     this.#nextCharge.scheduled_at,
        quantity:                     1,
        external_variant_id:          { ecommerce: variantId },
        addon_parent_subscription_id: sub.id,
        charge_interval_frequency:    sub.charge_interval_frequency,
        order_interval_frequency:     sub.order_interval_frequency,
        order_interval_unit:          sub.order_interval_unit,
      }, { commit: true });
      this.#added.add(key);
      document.dispatchEvent(new CustomEvent('Affinity:refresh'));
    } catch (err) {
      console.error(`[${TAG_NAME}] add error`, err?.message);
    } finally {
      this.#adding.delete(key);
      this._updateCardButton(variantId);
    }
  }

  _updateCardButton(variantId) {
    const status = this._statusOf(variantId);
    this.querySelectorAll(`[data-add-variant="${variantId}"]`).forEach(btn => {
      btn.textContent = buttonLabel(status);
      btn.disabled = status !== 'idle';
    });
  }

  // ─── Carousel area (re-rendered on parent switch / search) ────────────────

  _renderCarouselArea() {
    const area = this.querySelector('#ac-carousel-area');
    if (!area) return;
    area.innerHTML = this._carouselAreaHTML();
    this._attachCarouselListeners();
  }

  _carouselAreaHTML() {
    const products = this._filteredProducts();
    if (!products.length) {
      const msg = this.#searchQuery ? 'No results found.' : 'No add-ons available.';
      return `<p class="ac-empty">${msg}</p>`;
    }

    return `
      <div class="ac-track-wrap">
        ${this._arrowHTML('prev', 'Previous', ARROW_PREV)}
        <div class="ac-track" id="ac-track">${products.map(p => this._cardHTML(p)).join('')}</div>
        ${this._arrowHTML('next', 'Next', ARROW_NEXT)}
      </div>
    `;
  }

  _arrowHTML(dir, label, path) {
    return `
      <button class="ac-arrow ac-arrow-${dir}" id="ac-${dir}" aria-label="${label}">
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${path}</svg>
      </button>
    `;
  }

  _cardHTML(p) {
    const title    = escapeHtml(p.title);
    const status   = this._statusOf(p.variantId);
    const disabled = status !== 'idle' ? 'disabled' : '';
    const img = p.image
      ? `<img class="ac-card-img" src="${escapeHtml(p.image)}" alt="${title}" />`
      : `<div class="ac-card-img ac-card-img-empty"></div>`;

    return `
      <div class="ac-card">
        ${img}
        <p class="ac-card-title">${title}</p>
        ${p.variantTitle ? `<p class="ac-card-variant">${escapeHtml(p.variantTitle)}</p>` : ''}
        ${priceHtml(p.price, p.compareAt)}
        <div class="ac-card-spacer"></div>
        <button class="ac-card-btn" data-add-variant="${escapeHtml(p.variantId)}" ${disabled}>${buttonLabel(status)}</button>
      </div>
    `;
  }

  _skeletonCardsHTML() {
    const card = `
      <div class="ac-card ac-skeleton-card">
        <div class="ac-skel ac-skel-img"></div>
        <div class="ac-skel ac-skel-title"></div>
        <div class="ac-skel ac-skel-subtitle"></div>
        <div class="ac-skel ac-skel-price"></div>
        <div class="ac-card-spacer"></div>
        <div class="ac-skel ac-skel-btn"></div>
      </div>
    `;
    return `<div class="ac-track-wrap ac-track-wrap-skeleton"><div class="ac-track">${card.repeat(3)}</div></div>`;
  }

  _attachCarouselListeners() {
    const track = this.querySelector('#ac-track');
    if (!track) return;
    const prevBtn = this.querySelector('#ac-prev');
    const nextBtn = this.querySelector('#ac-next');

    // 2px slack absorbs sub-pixel scroll positions on zoomed / hi-dpi screens
    const updateArrows = () => {
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };

    track.addEventListener('scroll', updateArrows, { passive: true });
    prevBtn.addEventListener('click', () => track.scrollBy({ left: -STEP, behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => track.scrollBy({ left:  STEP, behavior: 'smooth' }));

    track.querySelectorAll('[data-add-variant]').forEach(btn => {
      btn.addEventListener('click', () => this._handleAdd(btn.dataset.addVariant));
    });

    requestAnimationFrame(updateArrows);
  }

  // ─── Full render ──────────────────────────────────────────────────────────

  _render() {
    if (this.#state === 'loading') {
      this.innerHTML = `
        <div class="ac-stack">
          <div class="ac-skel ac-skel-heading"></div>
          <div class="ac-skel ac-skel-search"></div>
          ${this._skeletonCardsHTML()}
        </div>
      `;
      return;
    }

    if (this.#state === 'error') {
      this.innerHTML = `
        <div class="ac-stack">
          <h2 class="ac-heading">${escapeHtml(HEADING)}</h2>
          <p class="ac-error">${escapeHtml(this.#errorMessage)}</p>
          <button class="ac-card-btn ac-retry" id="ac-retry">Try again</button>
        </div>
      `;
      this.querySelector('#ac-retry').addEventListener('click', () => this.refresh());
      return;
    }

    this.innerHTML = `
      <div class="ac-stack">
        <h2 class="ac-heading">${escapeHtml(HEADING)}</h2>
        ${this._parentSelectHTML()}
        <div class="ac-search-wrap">
          <span class="ac-search-icon" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2.2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
          </span>
          <input
            class="ac-search"
            type="search"
            id="ac-search-input"
            placeholder="Search products"
            aria-label="Search add-on products"
            value="${escapeHtml(this.#searchQuery)}"
          />
        </div>
        <div id="ac-carousel-area"></div>
      </div>
    `;

    this.querySelector('#ac-parent-select')?.addEventListener('change', e => {
      this._handleParentChange(Number(e.target.value));
    });
    this.querySelector('#ac-search-input').addEventListener('input', e => {
      this._handleSearch(e.target.value);
    });

    this._renderCarouselArea();
  }

  _parentSelectHTML() {
    if (this.#parents.length < 2) return '';
    const options = this.#parents.map(({ sub }, i) => {
      const selected = i === this.#selectedIdx ? 'selected' : '';
      return `<option value="${i}" ${selected}>${escapeHtml(this._subLabel(sub))}</option>`;
    }).join('');
    return `
      <div class="ac-field">
        <p class="ac-label">Add-ons for</p>
        <select class="ac-select" id="ac-parent-select">${options}</select>
      </div>
    `;
  }

  _subLabel(sub) {
    const title   = sub.product_title ?? '';
    const variant = cleanVariantTitle(sub.variant_title);
    if (variant) return `${title} - ${variant}`;
    return title || `Subscription ${sub.id}`;
  }

  refresh() {
    this.style.display = '';
    this.#session = null;
    this.#state = 'idle';
    this.#errorMessage = '';
    this.#nextCharge = null;
    this.#parents = [];
    this.#selectedIdx = 0;
    this.#adding = new Set();
    this.#added = new Set();
    this.#searchQuery = '';
    this._init();
  }
}

customElements.define(TAG_NAME, AddonsCarousel);
export default AddonsCarousel;
