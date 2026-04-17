# Recharge JS SDK

Use when an extension needs to read or mutate customer data (subscriptions, charges, products, etc.).

Full SDK reference: https://storefront.getrecharge.com/client/docs/methods/api/overview/

```js
const SDK_URL = 'https://static.rechargecdn.com/assets/storefront/recharge-client-1.81.0.min.js';
```

The SDK is a UMD bundle — load it as a `<script>` tag (not an ESM import) and access it via `window.recharge`.

## Authenticate

Inject the script once, call `window.recharge.init`, then `rc.auth.loginCustomerPortal()` to get a session. All subsequent SDK calls require the session.

```js
async _loadSdk() {
  if (!window.recharge) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SDK_URL;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Failed to load Recharge SDK'));
      document.head.appendChild(s);
    });
    window.recharge.init({ appName: 'my-extension' }); // use your extension's tag name
  }
  const rc = window.recharge;
  return {
    loginCustomerPortal: () => rc.auth.loginCustomerPortal(),
    // add the methods you need, e.g.:
    // listCharges:        (session, params)            => rc.charge.listCharges(session, params),
    // createOnetime:      (session, params)            => rc.onetime.createOnetime(session, params),
    // updateSubscription: (session, id, params, opts)  => rc.subscription.updateSubscription(session, id, params, opts),
    // productSearch:      (session, params)            => rc.product.productSearch(session, params),
  };
}

async _init() {
  const { loginCustomerPortal } = await this._loadSdk();
  this.#session = await loginCustomerPortal();
}
```

## Common namespaced methods

| What you want | Call |
|---|---|
| Authenticate | `rc.auth.loginCustomerPortal()` |
| List charges | `rc.charge.listCharges(session, params)` |
| Create one-time | `rc.onetime.createOnetime(session, params)` |
| Update subscription | `rc.subscription.updateSubscription(session, id, params, opts)` |
| Search products | `rc.product.productSearch(session, params)` |

## The `commit` param on subscription updates

Pass `{ commit: true }` when calling `updateSubscription` so changes are reflected in the queued charge immediately. Always forward `opts` through `_loadSdk()` so the call site can pass it:

```js
// _loadSdk()
updateSubscription: (session, id, params, opts) => rc.subscription.updateSubscription(session, id, params, opts),

// call site
await updateSubscription(this.#session, this.#subscriptionId, {
  external_variant_id: { ecommerce: TARGET_VARIANT_ID },
}, { commit: true });
```

## Trigger a portal refresh after a mutation

After any write operation (add, update, cancel), dispatch this event to tell the portal to reload other sections:

```js
document.dispatchEvent(new CustomEvent('Affinity:refresh'));
```

