// ─── CSS setup ───────────────────────────────────────────────────────────────
// Paste the contents of AFF_CSS from css-constants.js (repo root) here.
// Alternative: host skills/affinity-framework/assets/aff-framework.css on your own CDN and
// inject it as a <link> tag instead. See skills/affinity-framework/SKILL.md for both patterns.
const AFF_CSS = ``;

// Paste the contents of TW_CSS from css-constants.js here (optional —
// only needed if you use tw: layout classes, which this extension does).
const TW_CSS = String.raw``;

// ─── Configure these for your store ──────────────────────────────────────────

// CUSTOMIZE: Update the tag keys and labels to match your Shopify product tag
// taxonomy. The 'all' tab always shows everything and should not be removed.
// Each key must exactly match a Shopify tag applied to your products.
// Remove or add entries as needed — the carousel adapts automatically.
const TAB_TAGS = {
  category1: 'your-tag-1',
  category2: 'your-tag-2',
  category3: 'your-tag-3',
};

const TABS = [
  { key: 'all',       label: 'All' },
  { key: 'category1', label: 'Category 1' }, // CUSTOMIZE: update labels
  { key: 'category2', label: 'Category 2' },
  { key: 'category3', label: 'Category 3' },
];

const SDK_URL = 'https://static.rechargecdn.com/assets/storefront/recharge-client-1.81.0.min.js';

// Item width (200px) + gap (16px)
const STEP = 216;

class ProductCarousel extends HTMLElement {
  #session = null;
  #state = 'idle'; // idle | loading | error
  #errorMessage = '';
  #products = { all: [], category1: [], category2: [], category3: [] };
  #nextCharge = null; // { address_id, scheduled_at }
  #activeTab = 'all';
  #adding = new Set();
  #added = new Set();

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
      window.recharge.init({ appName: 'rc-product-carousel' });
    }
    const rc = window.recharge;
    return {
      loginCustomerPortal: () => rc.auth.loginCustomerPortal(),
      listCharges:   (session, params) => rc.charge.listCharges(session, params),
      createOnetime: (session, params, opts) => rc.onetime.createOnetime(session, params, opts),
      productSearch: (session, params) => rc.product.productSearch(session, params),
    };
  }

  async _init() {
    this.#state = 'loading';
    this._render();
    try {
      const { loginCustomerPortal, listCharges, productSearch } = await this._loadSdk();
      this.#session = await loginCustomerPortal();

      // Single fetch — Recharge productSearch does not filter by Shopify
      // collection IDs. Tab filtering is done client-side using product tags.
      const [chargeResult, allProds] = await Promise.all([
        listCharges(this.#session, { status: 'queued', sort_by: 'scheduled_at-asc', limit: 1 }),
        productSearch(this.#session, { format_version: '2022-06', limit: 50 }),
      ]);

      const nextCharge = chargeResult?.charges?.[0];
      if (nextCharge) {
        this.#nextCharge = {
          address_id:   nextCharge.address_id,
          scheduled_at: nextCharge.scheduled_at,
        };
        for (const li of nextCharge.line_items ?? []) {
          if (li.external_variant_id?.ecommerce) {
            this.#added.add(String(li.external_variant_id.ecommerce));
          }
        }
      }

      const all = this._normalizeProducts(allProds?.products ?? []);
      // CUSTOMIZE: update these keys to match TAB_TAGS above
      this.#products = {
        all,
        category1: all.filter(p => p.tags.includes(TAB_TAGS.category1)),
        category2: all.filter(p => p.tags.includes(TAB_TAGS.category2)),
        category3: all.filter(p => p.tags.includes(TAB_TAGS.category3)),
      };

      this.#state = 'idle';
      this._render();
    } catch (err) {
      this.#state = 'error';
      this.#errorMessage = err?.message ?? 'Failed to load products.';
      this._render();
    }
  }

  _normalizeProducts(products) {
    return products.map(prod => {
      const variant = prod.variants?.[0];
      // productSearch returns external_variant_id as a plain string,
      // unlike listCharges which returns it as { ecommerce: "..." }
      const rawVid = variant?.external_variant_id;
      const variantId = rawVid
        ? String(typeof rawVid === 'object' ? (rawVid.ecommerce ?? '') : rawVid)
        : '';
      const images = (prod.images ?? []).map(img => ({
        thumb: img.medium ?? img.large ?? img.small ?? '',
        full:  img.large  ?? img.medium ?? img.original ?? img.small ?? '',
      })).filter(img => img.full);
      return {
        variantId,
        title:       prod.title ?? '',
        images,
        description: prod.description ?? '',
        price:       variant?.prices?.[0]?.unit_price ?? null,
        tags:        prod.tags ?? [],
      };
    }).filter(p => p.variantId);
  }

  async _handleAdd(variantId) {
    if (this.#adding.has(variantId) || this.#added.has(variantId)) return;
    if (!this.#nextCharge) return;

    this.#adding.add(variantId);
    this._updateAddButton(variantId, 'adding');

    try {
      const { createOnetime } = await this._loadSdk();
      await createOnetime(this.#session, {
        address_id:               this.#nextCharge.address_id,
        next_charge_scheduled_at: this.#nextCharge.scheduled_at,
        quantity:                 1,
        external_variant_id:      { ecommerce: variantId },
      }, { commit: true });
      this.#adding.delete(variantId);
      this.#added.add(variantId);
      this._updateAddButton(variantId, 'added');
      document.dispatchEvent(new CustomEvent('Affinity:refresh'));
    } catch (err) {
      this.#adding.delete(variantId);
      this._updateAddButton(variantId, 'idle');
      console.error('[rc-product-carousel]', err?.message);
    }
  }

  _updateAddButton(variantId, status) {
    this.querySelectorAll(`[data-variant-id="${variantId}"]`).forEach(btn => {
      if (status === 'adding') {
        btn.textContent = 'Adding…';
        btn.disabled = true;
      } else if (status === 'added') {
        btn.textContent = 'Added ✓';
        btn.disabled = true;
      } else {
        btn.textContent = 'Add';
        btn.disabled = false;
      }
    });
  }

  _handleTabChange(tabKey) {
    if (this.#activeTab === tabKey) return;
    this.#activeTab = tabKey;

    this.querySelectorAll('[role="tab"]').forEach(tab => {
      const active = tab.dataset.tabKey === tabKey;
      tab.setAttribute('aria-selected', String(active));
      if (active) tab.removeAttribute('tabindex');
      else tab.setAttribute('tabindex', '-1');
    });

    this._renderCarousel();
  }

  _renderCarousel() {
    const outer = this.querySelector('#carousel-outer');
    if (!outer) return;
    outer.innerHTML = this._carouselHTML();
    this._attachCarouselListeners();
  }

  _carouselHTML() {
    const products = this.#products[this.#activeTab] ?? [];

    if (!products.length) {
      return `<p class="aff-text-body aff-text-sm aff-text-muted tw:py-2">No products available in this category.</p>`;
    }

    const items = products.map(p => {
      const title    = this._escapeHtml(p.title);
      const price    = p.price ? `$${parseFloat(p.price).toFixed(2)}` : '';
      const isAdded  = this.#added.has(p.variantId);
      const isAdding = this.#adding.has(p.variantId);
      const btnText  = isAdded ? 'Added ✓' : isAdding ? 'Adding…' : 'Add';
      const disabled = isAdded || isAdding || !this.#nextCharge ? 'disabled' : '';

      const imgInner = p.images[0]?.thumb
        ? `<img class="aff-img aff-img-lg tw:aspect-square tw:object-cover tw:block" src="${this._escapeHtml(p.images[0].thumb)}" alt="${title}" />`
        : `<div class="aff-img aff-img-lg tw:aspect-square tw:block" style="background:var(--recharge-color-neutral-20);"></div>`;

      const imgHtml = `
        <div class="tw:relative tw:cursor-pointer"
             data-info-variant-id="${this._escapeHtml(p.variantId)}"
             role="button"
             tabindex="0"
             aria-label="View ${title} details">
          ${imgInner}
          <span class="rc-pc-info-icon" aria-hidden="true">
            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
              <circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="5.5" fill="currentColor" r="1"/>
              <path d="M9 8.5v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>`;

      return `
        <div class="tw:flex tw:flex-col tw:items-center tw:gap-2 tw:shrink-0 tw:snap-start tw:text-center" style="width:200px;">
          ${imgHtml}
          <div class="tw:flex tw:flex-col tw:w-full tw:gap-1.5">
            <p class="aff-h4 aff-text-heading tw:w-full tw:line-clamp-2">${title}</p>
            ${price ? `<p class="aff-text-body aff-text-sm">${price}</p>` : ''}
          </div>
          <button
            class="recharge-button aff-btn aff-btn-primary aff-btn-sm tw:w-full tw:py-1.5 tw:px-2"
            data-variant-id="${this._escapeHtml(p.variantId)}"
            ${disabled}
          >${btnText}</button>
        </div>
      `;
    }).join('');

    return `
      <div
        id="carousel-track"
        role="region"
        aria-label="Product carousel"
        class="tw:flex tw:gap-4 tw:overflow-x-auto tw:snap-x tw:snap-mandatory tw:pt-1 tw:pb-1 tw:scrollbar-none"
      >
        <div class="tw:shrink-0 tw:w-5 tw:lg:w-6" aria-hidden="true"></div>
        ${items}
        <div class="tw:shrink-0 tw:w-5 tw:lg:w-6" aria-hidden="true"></div>
      </div>
    `;
  }

  _attachCarouselListeners() {
    const track   = this.querySelector('#carousel-track');
    const prevBtn = this.querySelector('#prev-btn');
    const nextBtn = this.querySelector('#next-btn');

    if (!track) return;

    const updateArrows = () => {
      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 0;
      if (nextBtn) nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    };

    track.addEventListener('scroll', updateArrows, { passive: true });
    prevBtn?.addEventListener('click', () => track.scrollBy({ left: -STEP, behavior: 'smooth' }));
    nextBtn?.addEventListener('click', () => track.scrollBy({ left:  STEP, behavior: 'smooth' }));

    track.querySelectorAll('[data-variant-id]').forEach(btn => {
      btn.addEventListener('click', () => this._handleAdd(btn.dataset.variantId));
    });

    track.querySelectorAll('[data-info-variant-id]').forEach(wrap => {
      wrap.addEventListener('click', () => this._openProductModal(wrap.dataset.infoVariantId));
      wrap.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._openProductModal(wrap.dataset.infoVariantId);
        }
      });
    });

    requestAnimationFrame(updateArrows);
  }

  _openProductModal(variantId) {
    const p = this.#products.all.find(x => x.variantId === variantId);
    if (!p) return;

    this.querySelector('#rc-pc-modal')?.remove();

    const title    = this._escapeHtml(p.title);
    const price    = p.price ? `$${parseFloat(p.price).toFixed(2)}` : '';
    const images   = p.images;
    const isAdded  = this.#added.has(p.variantId);
    const isAdding = this.#adding.has(p.variantId);
    const btnText  = isAdded ? 'Added ✓' : isAdding ? 'Adding…' : 'Add';
    const disabled = isAdded || isAdding || !this.#nextCharge ? 'disabled' : '';

    const hasArrows = images.length > 1;

    const mainImgHtml = images[0]?.full
      ? `<img id="rc-pc-modal-img" class="aff-img tw:w-full tw:aspect-square tw:object-cover" src="${this._escapeHtml(images[0].full)}" alt="${title}" />`
      : `<div class="aff-img tw:w-full tw:aspect-square" style="background:var(--recharge-color-neutral-20);"></div>`;

    const arrowsHtml = hasArrows ? `
      <button class="recharge-button rc-pc-arrow rc-pc-arrow-prev" id="rc-pc-prev" aria-label="Previous image" disabled>
        <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9.726 2.972L0.484 2.972M0.484 2.972L2.972 0.484M0.484 2.972L2.972 5.46" stroke="currentColor" stroke-width="0.968" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="recharge-button rc-pc-arrow rc-pc-arrow-next" id="rc-pc-next" aria-label="Next image">
        <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0.484 2.972H9.726M7.238 5.46L9.726 2.972L7.238 0.484" stroke="currentColor" stroke-width="0.968" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>` : '';

    const thumbsHtml = hasArrows
      ? `<div class="tw:flex tw:gap-2 tw:flex-wrap">
          ${images.map((img, i) => `
            <button class="recharge-button rc-pc-thumb${i === 0 ? ' rc-pc-thumb-active' : ''}"
                    data-thumb-idx="${i}"
                    aria-label="Image ${i + 1}">
              <img class="aff-img" src="${this._escapeHtml(img.thumb)}" alt="${title} image ${i + 1}" />
            </button>
          `).join('')}
        </div>`
      : '';

    const wrapper = document.createElement('div');
    wrapper.className = 'aff-modal-wrapper';
    wrapper.id = 'rc-pc-modal';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.innerHTML = `
      <div class="aff-modal" style="width:700px;">
        <div class="aff-modal-header">
          <div class="tw:flex tw:flex-col tw:gap-1">
            <h2 class="aff-h2 aff-text-heading">${title}</h2>
            ${price ? `<p class="aff-text-body aff-text-base">${price}</p>` : ''}
          </div>
          <button class="aff-modal-close" data-modal-close aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="m1 1 12 12M1 13 13 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="tw:flex tw:flex-col tw:lg:flex-row tw:gap-6">
          <div class="tw:flex tw:flex-col tw:gap-3 tw:shrink-0 tw:lg:w-1/2">
            <div style="position:relative;">
              ${mainImgHtml}
              ${arrowsHtml}
            </div>
            ${thumbsHtml}
          </div>
          <div class="tw:flex tw:flex-col tw:gap-3">
            ${p.description ? `<div class="aff-text-body aff-text-sm rc-pc-desc"></div>` : ''}
          </div>
        </div>
        <button
          class="recharge-button aff-btn aff-btn-primary aff-btn-full"
          data-variant-id="${this._escapeHtml(p.variantId)}"
          ${disabled}
        >${btnText}</button>
      </div>
    `;

    if (p.description) {
      wrapper.querySelector('.rc-pc-desc').innerHTML = p.description;
    }

    this.appendChild(wrapper);

    let currentIdx = 0;
    const mainImg  = wrapper.querySelector('#rc-pc-modal-img');
    const prevBtn  = wrapper.querySelector('#rc-pc-prev');
    const nextBtn  = wrapper.querySelector('#rc-pc-next');
    const thumbs   = wrapper.querySelectorAll('.rc-pc-thumb');

    const goTo = idx => {
      currentIdx = idx;
      if (mainImg) mainImg.src = images[currentIdx].full;
      thumbs.forEach((t, i) => t.classList.toggle('rc-pc-thumb-active', i === currentIdx));
      if (prevBtn) prevBtn.disabled = currentIdx === 0;
      if (nextBtn) nextBtn.disabled = currentIdx === images.length - 1;
    };

    prevBtn?.addEventListener('click', () => goTo(currentIdx - 1));
    nextBtn?.addEventListener('click', () => goTo(currentIdx + 1));
    thumbs.forEach((btn, i) => btn.addEventListener('click', () => goTo(i)));

    requestAnimationFrame(() => {
      wrapper.classList.add('is-open');
      wrapper.setAttribute('aria-hidden', 'false');
      wrapper.querySelector('.aff-modal-close')?.focus();
    });

    wrapper.querySelector('[data-modal-close]')?.addEventListener('click', () => this._closeProductModal());
    wrapper.addEventListener('click', e => { if (e.target === wrapper) this._closeProductModal(); });

    this._escKeyHandler = e => { if (e.key === 'Escape') this._closeProductModal(); };
    document.addEventListener('keydown', this._escKeyHandler);

    wrapper.querySelector('[data-variant-id]')?.addEventListener('click', e => {
      this._handleAdd(e.currentTarget.dataset.variantId);
    });
  }

  _closeProductModal() {
    const wrapper = this.querySelector('#rc-pc-modal');
    if (!wrapper) return;
    wrapper.classList.remove('is-open');
    wrapper.setAttribute('aria-hidden', 'true');
    if (this._escKeyHandler) {
      document.removeEventListener('keydown', this._escKeyHandler);
      this._escKeyHandler = null;
    }
    setTimeout(() => wrapper.remove(), 300);
  }

  _render() {
    if (this.#state === 'loading') {
      this.innerHTML = `
        <style>
          rc-product-carousel .rc-pc-spinner {
            width: 20px; height: 20px;
            border: 2px solid currentColor;
            border-top-color: transparent;
            border-radius: 50%;
            display: inline-block;
            animation: rcPcSpin 0.7s linear infinite;
          }
          @keyframes rcPcSpin { to { transform: rotate(360deg); } }
        </style>
        <div class="tw:flex tw:flex-col tw:gap-4">
          <h2 class="aff-h2 aff-text-heading">Add to your next order</h2>
          <div class="tw:flex tw:items-center tw:justify-center" style="height:200px;">
            <span class="rc-pc-spinner" aria-label="Loading products"></span>
          </div>
        </div>
      `;
      return;
    }

    if (this.#state === 'error') {
      this.innerHTML = `
        <div class="tw:flex tw:flex-col tw:gap-3">
          <h2 class="aff-h2 aff-text-heading">Add to your next order</h2>
          <div class="aff-alert aff-alert-error" role="alert">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">
              <path d="m10.423 5.577-4.846 4.846M5.577 5.577l4.846 4.846M8 15.429A7.429 7.429 0 1 0 8 .57 7.429 7.429 0 0 0 8 15.43Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="aff-text-body aff-text-sm">${this._escapeHtml(this.#errorMessage)}</p>
          </div>
          <button class="recharge-button aff-btn aff-btn-secondary" id="retry-btn">Try again</button>
        </div>
      `;
      this.querySelector('#retry-btn')?.addEventListener('click', () => this._handleRetry());
      return;
    }

    const tabsHtml = TABS.map(t => `
      <button
        class="aff-tab"
        role="tab"
        aria-selected="${t.key === this.#activeTab ? 'true' : 'false'}"
        ${t.key === this.#activeTab ? '' : 'tabindex="-1"'}
        data-tab-key="${t.key}"
      >${t.label}</button>
    `).join('');

    this.innerHTML = `
      <style>
        rc-product-carousel #carousel-track { scroll-padding-left: 20px; }
        @media (min-width: 1024px) {
          rc-product-carousel #carousel-track { scroll-padding-left: 24px; }
        }
        rc-product-carousel .rc-pc-info-icon {
          position: absolute; top: 6px; right: 6px;
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(255,255,255,0.88);
          display: flex; align-items: center; justify-content: center;
          color: var(--recharge-typography-primary, #3c352d);
          pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,.18);
        }
        rc-product-carousel .rc-pc-thumb {
          padding: 0; background: none; border: 2px solid transparent;
          border-radius: var(--recharge-corners-radius, 8px);
          cursor: pointer; line-height: 0; overflow: hidden;
          transition: border-color 0.15s ease;
        }
        rc-product-carousel .rc-pc-thumb img {
          width: 56px; height: 56px; object-fit: cover; display: block;
        }
        rc-product-carousel .rc-pc-thumb-active,
        rc-product-carousel .rc-pc-thumb:hover {
          border-color: var(--recharge-button-brand, #1773b0);
        }
        rc-product-carousel .rc-pc-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.92); border: none;
          border-radius: 50%; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.2); z-index: 1;
          transition: opacity 0.15s ease;
        }
        rc-product-carousel .rc-pc-arrow:disabled { opacity: 0; pointer-events: none; }
        rc-product-carousel .rc-pc-arrow-prev { left: 8px; }
        rc-product-carousel .rc-pc-arrow-next { right: 8px; }
      </style>
      <div class="tw:flex tw:flex-col tw:gap-4">
        <div class="tw:flex tw:items-center tw:justify-between tw:gap-2">
          <h2 class="aff-h2 aff-text-heading">Add to your next order</h2>
          <div class="tw:flex tw:gap-2 tw:shrink-0">
            <button class="recharge-button aff-btn aff-btn-secondary aff-btn-icon" id="prev-btn" aria-label="Previous" disabled>
              <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9.726 2.972L0.484 2.972M0.484 2.972L2.972 0.484M0.484 2.972L2.972 5.46" stroke="currentColor" stroke-width="0.968" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="recharge-button aff-btn aff-btn-secondary aff-btn-icon" id="next-btn" aria-label="Next">
              <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M0.484 2.972H9.726" stroke="currentColor" stroke-width="0.968" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.238 5.46L9.726 2.972L7.238 0.484" stroke="currentColor" stroke-width="0.968" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div id="tabs-outer" class="tw:-mx-5 tw:lg:-mx-6">
          <div class="aff-tabs tw:px-5 tw:lg:px-6 tw:overflow-x-auto tw:scrollbar-none" role="tablist" aria-label="Product categories">
            ${tabsHtml}
          </div>
        </div>
        <div id="carousel-outer" class="tw:-mx-5 tw:lg:-mx-6"></div>
      </div>
    `;

    this.querySelectorAll('[role="tab"]').forEach(tab => {
      tab.addEventListener('click', () => this._handleTabChange(tab.dataset.tabKey));
    });

    this._renderCarousel();
  }

  _handleRetry() {
    this.#state = 'idle';
    this.#errorMessage = '';
    this._render();
    this._init();
  }

  refresh() {
    this.style.display = '';
    this.#state = 'idle';
    this.#errorMessage = '';
    // CUSTOMIZE: update these keys to match TAB_TAGS
    this.#products = { all: [], category1: [], category2: [], category3: [] };
    this.#nextCharge = null;
    this.#activeTab = 'all';
    this.#adding = new Set();
    this.#added = new Set();
    this._render();
    this._init();
  }

  _escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  }
}

customElements.define('rc-product-carousel', ProductCarousel);
export default ProductCarousel;
