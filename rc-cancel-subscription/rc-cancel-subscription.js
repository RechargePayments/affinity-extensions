// Paste the contents of AFF_CSS from ../css-constants.js here.
// Alternatively, host the framework stylesheet and load it with a <link> tag.
const AFF_CSS = ``;

// Paste the contents of TW_CSS from ../css-constants.js here.
const TW_CSS = ``;

const EXTENSION_CONFIG = Object.freeze({
  cancelAll: true,
  textAlign: 'center',
  // Empty means all customers. Use USPS codes such as ['CA'] to restrict visibility.
  allowedUSStates: []
});

const US_STATE_CODE_BY_NAME = Object.freeze({
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA', kansas: 'KS',
  kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD', massachusetts: 'MA',
  michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO', montana: 'MT',
  nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND',
  ohio: 'OH', oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI',
  'south carolina': 'SC', 'south dakota': 'SD', tennessee: 'TN', texas: 'TX',
  utah: 'UT', vermont: 'VT', virginia: 'VA', washington: 'WA',
  'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
  'district of columbia': 'DC'
});

const EXTENSION_TAG = 'recharge-cancel-subscription';
const SDK_READY_TIMEOUT = 4500;
const SESSION_PROMISE_KEY = '__RechargePortalExtension2SessionPromiseV3';
const SESSION_KEY = 'RechargePortalExtension2SessionV3';
const SDK_URL = 'https://static.rechargecdn.com/assets/storefront/recharge-client-1.89.0.min.js';
const STORE_IDENTIFIER = 'YOUR_STORE_IDENTIFIER'; // CUSTOMIZE: Shopify store identifier
const STOREFRONT_ACCESS_TOKEN = 'YOUR_STOREFRONT_ACCESS_TOKEN'; // CUSTOMIZE: storefront access token
const APP_NAME = 'RechargePortalExtensions2';
const APP_VERSION = '2.4.3';

function normalizeUSState(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return '';
  if (/^[a-z]{2}$/i.test(normalized)) return normalized.toUpperCase();
  return US_STATE_CODE_BY_NAME[normalized.toLowerCase()] || normalized.toUpperCase();
}

function textAlignClass(value) {
  const alignment = String(value || '').toLowerCase();
  return `tw:text-${['left', 'center', 'right'].includes(alignment) ? alignment : 'center'}`;
}

function getAddressState(address) {
  return address?.province_code || address?.province || address?.state_code || address?.state || '';
}

/*
 * The new extensions share their own SDK session namespace. This keeps them
 * independent from the legacy portal's window.rechargeSession and token.
 */
function openModal(wrapper) {
  if (!wrapper) return;
  wrapper.classList.add('is-open');
  wrapper.setAttribute('aria-hidden', 'false');
  wrapper.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
}

function closeModal(wrapper) {
  if (!wrapper) return;
  wrapper.classList.remove('is-open');
  wrapper.setAttribute('aria-hidden', 'true');
}

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
  if (window.recharge?.customerSurveys?.getCustomerSurveyReasons) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    const script = existing || document.createElement('script');
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', () => reject(new Error(`Unable to load ${src}`)), { once: true });

    if (existing) {
      waitFor(() => window.recharge?.customerSurveys?.getCustomerSurveyReasons).then(resolve).catch(reject);
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
      if (!window.recharge?.customerSurveys?.getCustomerSurveyReasons) await loadScriptOnce(SDK_URL);

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

class RechargeCancelSubscription extends HTMLElement {
  #session = null;
  #subscriptions = [];
  #loading = false;
  #bulkBusy = false;
  #reasonsLoading = false;
  #cancellationReasons = [];
  #modalView = 'list';
  #errorMessage = '';
  #refreshId = 0;
  #handleKeydown = event => {
    if (event.key === 'Escape') closeModal(this.querySelector('#rce-cancel-modal'));
  };

  connectedCallback() {
    this.setAttribute('data-recharge-cancel-version', APP_VERSION);

    if (!document.querySelector('#aff-framework')) {
      const style = document.createElement('style');
      style.id = 'aff-framework';
      style.textContent = AFF_CSS;
      document.head.appendChild(style);
    }

    if (!document.querySelector('#tw-css')) {
      const style = document.createElement('style');
      style.id = 'tw-css';
      style.textContent = TW_CSS;
      document.head.appendChild(style);
    }

    document.addEventListener('keydown', this.#handleKeydown);
    this.hidden = true;
    this.refresh();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.#handleKeydown);
  }

  async refresh() {
    const refreshId = ++this.#refreshId;
    this.#loading = true;
    this.#bulkBusy = false;
    this.#modalView = 'list';
    this.#errorMessage = '';
    this.#subscriptions = [];
    this._render();

    try {
      const recharge = await this._getRecharge();
      const session = this.#session || await getRechargeExtension2Session();
      if (refreshId !== this.#refreshId) return;

      this.#session = session;
      const response = await recharge.subscription.listSubscriptions(session, {
        include: ['address'],
        limit: 100,
        sort_by: 'id-asc',
        status: 'Active'
      });
      if (refreshId !== this.#refreshId) return;

      const subscriptions = Array.isArray(response?.subscriptions) ? response.subscriptions : [];
      const isEligible = await this._hasEligibleUSStateAddress(recharge, session, subscriptions);
      if (refreshId !== this.#refreshId) return;

      this.#subscriptions = subscriptions;
      this.hidden = subscriptions.length === 0 || !isEligible;
      this.setAttribute(
        'data-recharge-cancel-eligibility',
        subscriptions.length === 0 ? 'no-active-subscriptions' : (isEligible ? 'eligible' : 'state-mismatch')
      );
    } catch (error) {
      if (refreshId !== this.#refreshId) return;
      this.#errorMessage = error?.message || 'Unable to load your subscriptions.';
      this.hidden = true;
      this.setAttribute('data-recharge-cancel-eligibility', 'error');
      this.setAttribute('data-recharge-cancel-error', this.#errorMessage.slice(0, 300));
      console.error('[recharge-cancel-subscription] Unable to load subscriptions.', error);
    } finally {
      if (refreshId === this.#refreshId) {
        this.#loading = false;
        this._render();
      }
    }
  }

  async _getRecharge() {
    if (!window.recharge?.customerSurveys?.getCustomerSurveyReasons) await loadScriptOnce(SDK_URL);
    return window.recharge;
  }

  async _hasEligibleUSStateAddress(recharge, session, subscriptions) {
    const allowedStates = new Set(
      EXTENSION_CONFIG.allowedUSStates.map(normalizeUSState).filter(Boolean)
    );
    if (allowedStates.size === 0) {
      this.setAttribute('data-recharge-cancel-observed-states', 'not-required');
      return true;
    }

    const observedStates = new Set();
    const matchesAddress = address => {
      const state = normalizeUSState(getAddressState(address));
      if (state) observedStates.add(state);
      return allowedStates.has(state);
    };

    for (const subscription of subscriptions) {
      const includedAddress = subscription?.include?.address || subscription?.address;
      if (includedAddress && matchesAddress(includedAddress)) {
        this.setAttribute('data-recharge-cancel-observed-states', [...observedStates].join(',') || 'none');
        return true;
      }
    }

    const addressIds = [...new Set(
      subscriptions.map(subscription => subscription.address_id).filter(addressId => addressId != null)
    )];

    for (const addressId of addressIds) {
      const response = await recharge.address.getAddress(session, addressId);
      const address = response?.address || response?.addresses?.[0] || response;
      if (matchesAddress(address)) {
        this.setAttribute('data-recharge-cancel-observed-states', [...observedStates].join(',') || 'none');
        return true;
      }
    }

    this.setAttribute('data-recharge-cancel-observed-states', [...observedStates].join(',') || 'none');
    return false;
  }

  _render() {
    if (this.hidden || this.#loading || this.#subscriptions.length === 0) {
      this.replaceChildren();
      return;
    }

    const hasMultipleSubscriptions = this.#subscriptions.length > 1;
    const triggerAttributes = hasMultipleSubscriptions
      ? 'data-modal-open="rce-cancel-modal" aria-haspopup="dialog"'
      : `data-subscription-id="${this._escapeHtml(this.#subscriptions[0].id)}"`;

    this.innerHTML = `
      <div class="${textAlignClass(EXTENSION_CONFIG.textAlign)}">
        ${!hasMultipleSubscriptions && this.#errorMessage ? this._errorMarkup(this.#errorMessage) : ''}
        <a href="#" class="aff-link" ${triggerAttributes}>
          Cancel subscription
        </a>
      </div>
      ${hasMultipleSubscriptions ? `
        <div class="aff-modal-wrapper" id="rce-cancel-modal" aria-hidden="true" role="presentation">
          <section class="aff-modal" role="dialog" aria-modal="true" aria-labelledby="rce-cancel-title">
            <div class="aff-modal-header">
              <h2 id="rce-cancel-title" class="aff-h1 aff-text-heading">
                ${this.#modalView === 'bulk' ? 'Cancel all subscriptions' : 'Subscriptions'}
              </h2>
              <button type="button" class="aff-modal-close" data-modal-close aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="m1 1 12 12M1 13 13 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            ${this.#modalView === 'bulk' ? this._bulkCancellationMarkup() : this._subscriptionListMarkup()}
          </section>
        </div>
      ` : ''}
    `;

    this.querySelector('[data-modal-open]')?.addEventListener('click', event => {
      event.preventDefault();
      openModal(this.querySelector('#rce-cancel-modal'));
    });
    this.querySelector('[data-modal-close]')?.addEventListener('click', () => {
      closeModal(this.querySelector('#rce-cancel-modal'));
    });
    this.querySelector('#rce-cancel-modal')?.addEventListener('click', event => {
      if (event.target === event.currentTarget) closeModal(event.currentTarget);
    });
    this.querySelectorAll('[data-subscription-id]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        this._redirectToChurnPage(button);
      });
    });
    this.querySelector('[data-cancel-all]')?.addEventListener('click', async () => {
      this.#modalView = 'bulk';
      this.#errorMessage = '';
      this.#reasonsLoading = true;
      this.#cancellationReasons = [];
      this._render();
      openModal(this.querySelector('#rce-cancel-modal'));
      await this._loadCancellationReasons();
    });
    this.querySelector('[data-cancel-all-back]')?.addEventListener('click', () => {
      this.#modalView = 'list';
      this.#errorMessage = '';
      this._render();
      openModal(this.querySelector('#rce-cancel-modal'));
    });
    this.querySelector('[data-cancel-all-form]')?.addEventListener('submit', event => {
      event.preventDefault();
      this._cancelAllSubscriptions(event.currentTarget);
    });
  }

  _subscriptionListMarkup() {
    return `
      ${this.#errorMessage ? this._errorMarkup(this.#errorMessage) : ''}
      <div aria-label="Active subscriptions">
        ${this.#subscriptions.map((subscription, index) => this._subscriptionMarkup(subscription, index)).join('')}
      </div>
      ${EXTENSION_CONFIG.cancelAll ? `
        <div class="tw:pt-4">
          <button type="button" class="recharge-button aff-btn aff-btn-secondary aff-btn-full" data-cancel-all>
            Cancel all subscriptions
          </button>
        </div>
      ` : ''}
    `;
  }

  _bulkCancellationMarkup() {
    return `
      <form data-cancel-all-form class="tw:flex tw:flex-col tw:gap-4">
        <p class="aff-text-body aff-text-base">
          This will cancel all ${this.#subscriptions.length} active subscriptions.
        </p>
        <div class="tw:flex tw:flex-col tw:gap-2">
          <label class="aff-text-body aff-text-base" for="rce-cancellation-reason">
            Why do you want to cancel?
          </label>
          ${this.#reasonsLoading
            ? '<p class="aff-text-body aff-text-sm aff-text-muted">Loading cancellation reasons...</p>'
            : `<div class="aff-select">
              <select id="rce-cancellation-reason" name="cancellation_reason" required ${this.#cancellationReasons.length ? '' : 'disabled'}>
                <option value="">Select a reason</option>
                ${this.#cancellationReasons.map(reason => `<option value="${this._escapeHtml(reason.response)}">${this._escapeHtml(reason.response)}</option>`).join('')}
              </select>
              <span class="aff-select-chevron" aria-hidden="true">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>`}
        </div>
        <div class="tw:flex tw:flex-col tw:gap-2">
          <label class="aff-text-body aff-text-base" for="rce-cancellation-comments">
            Additional comments
          </label>
          <div class="aff-input">
            <textarea id="rce-cancellation-comments" name="cancellation_reason_comments" class="tw:flex-1 tw:w-full" rows="4" required maxlength="1024"></textarea>
          </div>
        </div>
        <div data-bulk-error ${this.#errorMessage ? '' : 'hidden'}>
          ${this.#errorMessage ? this._errorMarkup(this.#errorMessage) : ''}
        </div>
        <div class="tw:flex tw:flex-col tw:gap-2">
          <button type="submit" class="recharge-button aff-btn aff-btn-primary aff-btn-full" ${this.#bulkBusy || this.#reasonsLoading || !this.#cancellationReasons.length ? 'disabled' : ''}>
            ${this.#bulkBusy ? 'Cancelling...' : 'Cancel all subscriptions'}
          </button>
          <button type="button" class="recharge-button aff-btn aff-btn-tertiary aff-btn-full" data-cancel-all-back ${this.#bulkBusy ? 'disabled' : ''}>
            Back
          </button>
        </div>
      </form>
    `;
  }

  _errorMarkup(message) {
    return `
      <div class="aff-alert aff-alert-error" role="alert">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">
          <path d="m10.423 5.577-4.846 4.846M5.577 5.577l4.846 4.846M8 15.429A7.429 7.429 0 1 0 8 .57 7.429 7.429 0 0 0 8 15.43Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="aff-text-body aff-text-sm">${this._escapeHtml(message)}</p>
      </div>
    `;
  }

  _subscriptionMarkup(subscription, index) {
    const productTitle = this._escapeHtml(subscription.product_title || 'Product');
    const variantTitle = subscription.variant_title
      ? `<p class="aff-text-body aff-text-sm aff-text-muted">${this._escapeHtml(subscription.variant_title)}</p>`
      : '';
    const deliveryFrequency = this._escapeHtml(this._formatDeliveryFrequency(subscription));
    const id = this._escapeHtml(subscription.id);

    return `
      <div class="tw:-mx-6 tw:flex tw:items-center tw:justify-between tw:gap-4 tw:px-6 tw:py-4"${index < this.#subscriptions.length - 1 ? ' style="border-bottom: 1px solid var(--recharge-color-neutral-30, #e8e4e0);"' : ''}>
        <div class="tw:flex tw:flex-col tw:gap-1">
          <h3 class="aff-h4 aff-text-heading">${productTitle}</h3>
          ${variantTitle}
          <p class="aff-text-body aff-text-sm aff-text-muted">${deliveryFrequency}</p>
        </div>
        <button type="button" class="recharge-button aff-btn aff-btn-secondary aff-btn-sm" data-subscription-id="${id}">Cancel</button>
      </div>
    `;
  }

  _formatDeliveryFrequency(subscription) {
    const frequency = Number(subscription.order_interval_frequency);
    const unit = String(subscription.order_interval_unit || '').toLowerCase();
    if (!Number.isFinite(frequency) || frequency <= 0 || !unit) return 'Delivery frequency unavailable';
    return `Every ${frequency} ${unit}${frequency === 1 ? '' : 's'}`;
  }

  async _redirectToChurnPage(button) {
    if (button.disabled) return;
    const subscriptionId = button.dataset.subscriptionId;
    if (!subscriptionId) return;

    button.disabled = true;
    button.textContent = 'Redirecting...';
    this.#errorMessage = '';

    try {
      const recharge = await this._getRecharge();
      const response = await recharge.customer.getActiveChurnLandingPageURL(
        this.#session,
        subscriptionId,
        window.location.href
      );
      const churnUrl = typeof response === 'string'
        ? response
        : response?.url || response?.churn_landing_page_url;

      if (!churnUrl) throw new Error('Recharge did not return a cancellation page URL.');
      window.location.assign(churnUrl);
    } catch (error) {
      this.#errorMessage = error?.message || 'Unable to start cancellation. Please try again.';
      button.disabled = false;
      button.textContent = 'Cancel';
      this._render();
      if (this.#subscriptions.length > 1) openModal(this.querySelector('#rce-cancel-modal'));
      console.error('[recharge-cancel-subscription] Unable to open churn page.', error);
    }
  }

  async _loadCancellationReasons() {
    try {
      const recharge = await this._getRecharge();
      const customerId = Number(this.#session?.customerId);
      const subscriptionId = Number(this.#subscriptions[0]?.id);
      if (!customerId || !subscriptionId) {
        throw new Error('Unable to identify the customer or subscription.');
      }

      const response = await recharge.customerSurveys.getCustomerSurveyReasons(
        this.#session,
        customerId,
        subscriptionId
      );
      this.#cancellationReasons = Array.isArray(response?.responses)
        ? response.responses.filter(reason => reason?.response)
        : [];
      if (!this.#cancellationReasons.length) {
        throw new Error('Recharge did not return any cancellation reasons.');
      }
    } catch (error) {
      this.#cancellationReasons = [];
      this.#errorMessage = error?.message || 'Unable to load cancellation reasons.';
      console.error('[recharge-cancel-subscription] Unable to load cancellation reasons.', error);
    } finally {
      this.#reasonsLoading = false;
      this._render();
      openModal(this.querySelector('#rce-cancel-modal'));
      this.querySelector('#rce-cancellation-reason')?.focus();
    }
  }

  async _cancelAllSubscriptions(form) {
    if (this.#bulkBusy) return;

    const textarea = form.querySelector('#rce-cancellation-comments');
    const reasonSelect = form.querySelector('#rce-cancellation-reason');
    const cancellationReason = reasonSelect?.value || '';
    const comments = textarea?.value.trim() || '';
    if (!cancellationReason) {
      reasonSelect?.reportValidity();
      return;
    }
    if (!comments) {
      textarea?.setCustomValidity('Please tell us why you want to cancel.');
      textarea?.reportValidity();
      return;
    }
    textarea.setCustomValidity('');

    const groupedSubscriptions = new Map();
    for (const subscription of this.#subscriptions) {
      const addressId = subscription.address_id;
      if (addressId === undefined || addressId === null) {
        this._showBulkError('A subscription is missing its address information. Please try again.');
        return;
      }
      const subscriptions = groupedSubscriptions.get(String(addressId)) || [];
      subscriptions.push(subscription);
      groupedSubscriptions.set(String(addressId), subscriptions);
    }

    this.#bulkBusy = true;
    this.setAttribute('aria-busy', 'true');
    const submitButton = form.querySelector('button[type="submit"]');
    const backButton = form.querySelector('[data-cancel-all-back]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Cancelling...';
    }
    if (backButton) backButton.disabled = true;

    let completedBatches = 0;
    try {
      const recharge = await this._getRecharge();
      for (const [addressId, subscriptions] of groupedSubscriptions) {
        for (let index = 0; index < subscriptions.length; index += 20) {
          const updates = subscriptions.slice(index, index + 20).map(subscription => ({
            id: Number(subscription.id),
            status: 'CANCELLED',
            cancellation_reason: cancellationReason,
            cancellation_reason_comments: comments
          }));

          await recharge.subscription.updateSubscriptions(
            this.#session,
            addressId,
            updates,
            { commit: true }
          );
          completedBatches += 1;
        }
      }

      closeModal(this.querySelector('#rce-cancel-modal'));
      this.#subscriptions = [];
      this.hidden = true;
      this.replaceChildren();
      document.dispatchEvent(new CustomEvent('Affinity:refresh'));
    } catch (error) {
      const fallback = completedBatches > 0
        ? 'Some subscriptions were cancelled, but the full request did not finish. Please review your subscriptions before trying again.'
        : 'Unable to cancel your subscriptions. Please try again.';
      this._showBulkError(completedBatches > 0 ? fallback : (error?.message || fallback));
      console.error('[recharge-cancel-subscription] Unable to cancel all subscriptions.', error);
    } finally {
      this.#bulkBusy = false;
      this.setAttribute('aria-busy', 'false');
      if (submitButton?.isConnected) {
        submitButton.disabled = false;
        submitButton.textContent = 'Cancel all subscriptions';
      }
      if (backButton?.isConnected) backButton.disabled = false;
    }
  }

  _showBulkError(message) {
    this.#errorMessage = message;
    const errorContainer = this.querySelector('[data-bulk-error]');
    if (!errorContainer) return;
    errorContainer.hidden = false;
    errorContainer.innerHTML = this._errorMarkup(message);
  }

  _escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }
}

if (!customElements.get(EXTENSION_TAG)) {
  customElements.define(EXTENSION_TAG, RechargeCancelSubscription);
}

export default RechargeCancelSubscription;
