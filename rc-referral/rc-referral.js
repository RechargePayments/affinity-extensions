const EXTENSION_TAG = 'rc-referral';
const SDK_READY_TIMEOUT = 4500;
// Same session namespace as the other Affinity extensions (e.g. rc-cancel-subscription) so they share one login.
const SESSION_PROMISE_KEY = '__RechargePortalExtension2SessionPromiseV3';
const SESSION_KEY = 'RechargePortalExtension2SessionV3';
const SDK_URL = 'https://static.rechargecdn.com/assets/storefront/recharge-client-1.89.0.min.js';
const STORE_IDENTIFIER = 'YOUR_STORE_IDENTIFIER'; // CUSTOMIZE: Shopify domain, e.g. your-store.myshopify.com
const STOREFRONT_ACCESS_TOKEN = 'YOUR_STOREFRONT_ACCESS_TOKEN'; // CUSTOMIZE: storefront access token
const APP_NAME = 'RechargePortalExtensions2';
const APP_VERSION = '2.4.3';

// customerSurveys only exists on the newer SDK, so it tells us the portal's legacy window.recharge is not usable.
const sdkReady = () => !!window.recharge?.customerSurveys?.getCustomerSurveyReasons;

function waitFor(check, timeout = SDK_READY_TIMEOUT, interval = 50) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const poll = () => {
      const value = check();
      if (value) {
        resolve(value);
      } else if (Date.now() - startedAt >= timeout) {
        reject(new Error('Timed out waiting for the Recharge SDK.'));
      } else {
        window.setTimeout(poll, interval);
      }
    };
    poll();
  });
}

function loadScriptOnce(src) {
  if (sdkReady()) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    const script = existing || document.createElement('script');
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', () => reject(new Error(`Unable to load ${src}`)), { once: true });

    if (existing) {
      waitFor(sdkReady).then(resolve).catch(reject);
    } else {
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

async function getRechargeExtension2Session() {
  if (window[SESSION_KEY]) return window[SESSION_KEY];

  if (!window[SESSION_PROMISE_KEY]) {
    window[SESSION_PROMISE_KEY] = (async () => {
      if (!sdkReady()) await loadScriptOnce(SDK_URL);

      await window.recharge.init({
        storeIdentifier: STORE_IDENTIFIER,
        storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
        appName: APP_NAME,
        appVersion: APP_VERSION,
        loginRetryFn: async () => {
          const session = await window.recharge.auth.loginCustomerPortal();
          window[SESSION_KEY] = session;
          return session;
        }
      });

      window[SESSION_KEY] = await window.recharge.auth.loginCustomerPortal();
      return window[SESSION_KEY];
    })().catch(error => {
      window[SESSION_PROMISE_KEY] = null;
      throw error;
    });
  }

  return window[SESSION_PROMISE_KEY];
}

// Paste the contents of AFF_CSS from ../css-constants.js here.
// Alternatively, host the framework stylesheet and load it with a <link> tag.
const AFF_CSS = ``;
// Paste the contents of TW_CSS from ../css-constants.js here.
const TW_CSS = ``;

// Extension-specific styles (steps timeline, share bar). Prefixed with ref- to avoid collisions.
const REF_CSS = `
.ref-step-num {
  width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--recharge-color-brand, #ef9490) 35%, white);
  font-family: var(--recharge-typography-heading-font-family, inherit);
  font-size: 18px; letter-spacing: 0.05em; color: inherit;
}
.ref-step { position: relative; display: flex; gap: 20px; padding-bottom: 24px; }
.ref-step:last-child { padding-bottom: 0; }
.ref-step:not(:last-child)::before {
  content: ''; position: absolute; left: 23px; top: 52px; bottom: 4px;
  border-left: 2px dotted var(--recharge-color-brand, #ef9490);
}
.ref-heading { color: var(--recharge-typography-primary, #3c352d) !important; }
.ref-step { align-items: flex-start; }
.ref-code-bar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 8px 8px 8px 16px;
  background: color-mix(in srgb, var(--recharge-color-brand, #ef9490) 40%, white);
}
.ref-code-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ref-share-link {
  display: flex; align-items: center; justify-content: center;
  width: 48px; height: 48px; border-radius: 10px; color: inherit; text-decoration: none;
}
.ref-share-link.ref-whatsapp { background: #25d366; color: #fff; }
`;

class ReferralExtension extends HTMLElement {
  #session = null;
  #state = 'idle'; // idle | loading | success | error
  #errorMessage = '';
  #data = null; // { url, slug }
  #isFallback = false; // true when showing the example link because the real one could not be fetched
  #copied = false;
  #copyTimer = null;

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

    if (!document.querySelector('#rc-referral-css')) {
      const s = document.createElement('style');
      s.id = 'rc-referral-css';
      s.textContent = REF_CSS;
      document.head.appendChild(s);
    }

    this._render();
    this._init();
  }

  disconnectedCallback() {
    clearTimeout(this.#copyTimer);
  }

  async _init() {
    try {
      this.#state = 'loading';
      this.#session = this.#session || await getRechargeExtension2Session();
      // Same call as https://storefront.getrecharge.com/client/docs/examples/rewards/get_customer_referral_url/
      const customer = await window.recharge.customer.getCustomer(this.#session, { include: ['referral_info'] });
      // The API nests included data under customer.include; the docs example reads customer.referral_info directly.
      const referral = customer?.include?.referral_info?.referral_url ?? customer?.referral_info?.referral_url;
      if (referral?.url) {
        this.#data = { url: referral.url, slug: referral.slug };
        this.#isFallback = false;
      } else {
        console.warn('[rc-referral] No referral_info.referral_url in getCustomer response; showing fallback.', customer);
        this._useFallback();
      }
      this.#state = 'success';
      this._render();
    } catch (err) {
      console.error('[rc-referral] Failed to fetch referral URL; showing fallback.', err);
      this._useFallback();
      this.#state = 'success';
      this._render();
    }
  }

  _useFallback() {
    const url = this._attr('fallback-url', 'https://rc-refer.com/example123');
    this.#data = { url, slug: url.split('/').pop() };
    this.#isFallback = true;
  }

  // Attribute overrides let merchants change copy in the Page Builder without editing code.
  _attr(name, fallback) {
    return this.getAttribute(name) ?? fallback;
  }

  _render() {
    if (this.#state === 'error') {
      this.innerHTML = `
        <div class="aff-alert aff-alert-error" role="alert">
          <p class="aff-text-body aff-text-sm">${this._escapeHtml(this.#errorMessage)}</p>
        </div>`;
      return;
    }
    if (!this.#data) { this.innerHTML = ''; return; }

    const url = this.#data.url;
    const enc = encodeURIComponent(url);
    const shareText = encodeURIComponent(`${this._attr('share-message', 'Use my link for a discount on your first order:')} ${url}`);
    const subject = encodeURIComponent(this._attr('email-subject', 'A little something for you'));

    const steps = [
      [this._attr('step-1-title', 'Share your link'), this._attr('step-1-body', 'Send it to a friend by WhatsApp, text or email.')],
      [this._attr('step-2-title', 'Your friend orders'), this._attr('step-2-body', 'They get a discount on their first order.')],
      [this._attr('step-3-title', 'You earn credit'), this._attr('step-3-body', "Credit is added to your account once they've bought.")],
    ];

    this.innerHTML = `
      <div class="tw:flex tw:flex-col tw:gap-6">
        <h2 class="aff-h2 aff-text-heading ref-heading" style="text-align:center;">
          ${this._escapeHtml(this._attr('heading', 'Introduce your friends to us.'))}
        </h2>

        <div class="tw:flex tw:flex-col">
          ${steps.map(([title, body], i) => `
            <div class="ref-step">
              <div class="ref-step-num" aria-hidden="true">0${i + 1}</div>
              <div class="tw:flex tw:flex-col tw:gap-1">
                <h3 class="aff-h3 aff-text-heading ref-heading">${this._escapeHtml(title)}</h3>
                <p class="aff-text-body aff-text-base">${this._escapeHtml(body)}</p>
              </div>
            </div>`).join('')}
        </div>

        ${this.#isFallback && !this.hasAttribute('hide-fallback-notice') ? `
        <div class="aff-callout" role="status">
          <p class="aff-text-body aff-text-sm">Example link shown. Your real referral link could not be loaded.</p>
        </div>` : ''}


        <div class="ref-code-bar">
          <span class="aff-text-body aff-text-base ref-code-text" id="ref-url">${this._escapeHtml(url)}</span>
          <button class="recharge-button aff-btn aff-btn-primary tw:shrink-0" id="ref-copy" type="button">
            ${this.#copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>

        <div class="tw:flex tw:items-center tw:justify-center tw:gap-6" role="group" aria-label="Share your link">
          <a class="ref-share-link ref-whatsapp" style="background:#25d366 !important; color:#ffffff !important;" href="https://wa.me/?text=${shareText}" target="_blank" rel="noopener" aria-label="Share on WhatsApp">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff" style="display:block; fill:#ffffff !important;" aria-hidden="true"><path fill="#ffffff" style="fill:#ffffff !important;" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          </a>
          <a class="ref-share-link" href="sms:?&body=${shareText}" aria-label="Share by text message">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5h12v8H8l-3 3v-3H3zM9 13v2h6l3 3v-3h3V9h-4"/></svg>
          </a>
          <a class="ref-share-link" href="mailto:?subject=${subject}&body=${shareText}" aria-label="Share by email">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="6" width="16" height="12"/><path d="m6 6 8 7 8-7M2 9h3M3 12h2M4 15h1"/></svg>
          </a>
          <button class="recharge-button ref-share-link" id="ref-native-share" type="button" aria-label="Share" style="background:none; border:none; padding:0; cursor:pointer;" hidden>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 3 3 10.5l7 3 3 7zM10 13.5 21 3"/></svg>
          </button>
        </div>
      </div>
    `;

    this.querySelector('#ref-copy')?.addEventListener('click', () => this._copy(url));

    const nativeBtn = this.querySelector('#ref-native-share');
    if (nativeBtn && navigator.share) {
      nativeBtn.hidden = false;
      nativeBtn.addEventListener('click', () => {
        navigator.share({ title: this._attr('email-subject', 'A little something for you'), url }).catch(() => {});
      });
    }
  }

  async _copy(url) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      this.#copied = true;
      this._render();
      clearTimeout(this.#copyTimer);
      this.#copyTimer = setTimeout(() => { this.#copied = false; this._render(); }, 2000);
    } catch {
      this.#errorMessage = 'Could not copy the link. Please copy it manually.';
      this.#state = 'error';
      this._render();
    }
  }

  // Required by the portal — called when a configured event fires
  refresh() {
    this.#state = 'idle';
    this.#data = null;
    this.#isFallback = false;
    this._render();
    this._init();
  }

  _escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  }
}

if (!customElements.get(EXTENSION_TAG)) {
  customElements.define(EXTENSION_TAG, ReferralExtension);
}
export default ReferralExtension;
