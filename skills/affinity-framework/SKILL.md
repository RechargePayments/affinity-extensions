---
name: affinity-framework
description: >-
  Use when building any UI component or extension for the Recharge Affinity customer portal. Covers the full
  authoring workflow: aff-* CSS classes for branded styling, Tailwind (tw: prefix) for layout, Web Component
  structure, and Recharge JS SDK integration for customer data. Always use this skill for any Affinity extension
  work, even for small or layout-only tasks.
---

# Affinity Framework

The output is always a Web Component (plain `HTMLElement`, no Shadow DOM) that can be registered and used in the Affinity Page Builder.

Two styling layers work together:
- **`aff-*` classes** — branding: typography, buttons, forms, cards, badges, alerts, modals, tabs. All driven by Recharge's CSS variables so they match the merchant's theme automatically.
- **Tailwind (`tw:` prefix)** — layout, spacing, responsive behaviour (`tw:flex`, `tw:grid`, `tw:gap-4`, etc.).

When an extension needs customer data, use the **Recharge JS SDK** — see [sdk.md](references/sdk.md) for the auth setup and a pointer to the full reference.

---

## Extension structure

Use this as the starting skeleton.

### CSS loading

**`aff-framework.css` is required.** **`tw.css` is optional but strongly encouraged** — all examples in this skill use `tw:` classes for layout. Skip it only if managing layout yourself, and avoid `tw:` classes entirely if you do.

**Asset paths:** `assets/aff-framework.css` and `assets/tw.css` (relative to this skill directory).

- **Default (inline constants):** paste the full CSS as `AFF_CSS` / `TW_CSS` template literals, inject via `<style>` elements — zero external dependencies. See skeleton below.
- **Alternative (external `<link>`):** host the files (Shopify theme asset, CDN, etc.) and inject as `<link rel="stylesheet">` with the same ID-guard pattern. Good when multiple extensions share one CSS source.

```js
const SDK_URL = 'https://static.rechargecdn.com/assets/storefront/recharge-client-1.81.0.min.js';

const AFF_CSS = `/* full content of assets/aff-framework.css */`;

// Optional — include if using tw: classes for layout (all examples in this skill use it)
const TW_CSS = `/* full content of assets/tw.css */`;

class MyExtension extends HTMLElement {
  // Private state
  #session = null;
  #state = 'idle'; // idle | loading | success | error
  #errorMessage = '';
  #data = null;

  connectedCallback() {
    // Guards ensure CSS is only injected once even when multiple extensions coexist on the same page.
    // The first extension to run adds the <style> tags; all others find the IDs and skip.
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

    // Import only the JS utilities you need
    // import(new URL('./aff-modal.js', import.meta.url).href).then(({ initModal }) => initModal(this));

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
      window.recharge.init({ appName: 'my-extension' }); // use your extension's tag name
    }
    const rc = window.recharge;
    return {
      loginCustomerPortal: () => rc.auth.loginCustomerPortal(),
      // add the methods you need, e.g.:
      // listCharges:   (session, params) => rc.charge.listCharges(session, params),
      // createOnetime: (session, params) => rc.onetime.createOnetime(session, params),
      // productSearch: (session, params) => rc.product.productSearch(session, params),
    };
  }

  async _init() {
    try {
      const { loginCustomerPortal } = await this._loadSdk();
      this.#session = await loginCustomerPortal();
      // fetch data here, then set this.#data
      this._render();
    } catch (err) {
      this.#state = 'error';
      this.#errorMessage = err?.message ?? 'Failed to load.';
      this._render();
    }
  }

  _render() {
    // Render nothing until data is ready
    if (!this.#data) { this.innerHTML = ''; return; }

    this.innerHTML = `
      <div class="tw:flex tw:flex-col tw:gap-4">
        <!-- content here -->
      </div>
    `;

    // Re-attach event listeners after every render (innerHTML wipes them)
    this.querySelector('#my-btn')?.addEventListener('click', () => this._handleAction());
  }

  async _handleAction() {
    if (this.#state === 'loading') return;
    this.#state = 'loading';
    this._render();
    try {
      // SDK call
      this.style.display = 'none';
      document.dispatchEvent(new CustomEvent('Affinity:refresh')); // tell portal to reload
    } catch (err) {
      this.#state = 'error';
      this.#errorMessage = err?.message ?? 'Something went wrong.';
      this._render();
    }
  }

  // Required by the portal — called when a configured event fires
  refresh() {
    this.style.display = '';
    this.#state = 'idle';
    this.#data = null;
    this._render();
    this._init();
  }

  _escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  }
}

customElements.define('my-extension', MyExtension);
export default MyExtension;
```

---

## Key rules

- **NEVER invent class names.** Only use `tw:` classes confirmed to exist in `assets/tw.css` and `aff-` classes confirmed to exist in `assets/aff-framework.css`. A made-up class silently does nothing — there is no error, no warning, just broken styling. When in doubt, grep the file before using the class.
- **No Shadow DOM.** Shadow DOM breaks Tailwind and Recharge's CSS variable inheritance.
- **Default export** the class. Named exports are not supported by the Page Builder.
- **`customElements.define('tag-name', ClassName)`** — tag name must start with a lowercase letter, contain a hyphen, and use only lowercase letters, digits, hyphens, dots, or underscores. Every extension must have a **unique tag name** — reusing a name across files causes a `NotSupportedError` and breaks both extensions.
- **CSS is injected once per page.** The `#aff-framework` / `#tw-css` ID guards in `connectedCallback` ensure shared styles are only written to `<head>` once, whether you inject via `<style>` (inline) or `<link>` (external). Never remove these guards.
- **Always add `recharge-button`** alongside `aff-btn`. The portal's global button styles will override appearance otherwise.
- **Prefer confirmed `tw:` classes over `style=""`** — but only if the class exists in `assets/tw.css`. A missing `tw:` class silently does nothing. Rule: confirmed → use the class; not in bundle → use `style=""`.
- **All Tailwind utilities need `tw:`** — `tw:flex`, `tw:grid-cols-2`, `tw:gap-4`, etc. The bundle covers layout, flexbox, grid, and spacing only — no color, typography, or animation. **BEFORE using any `tw:` class, search `assets/tw.css` to confirm it exists.** Using a class that is not in the bundle silently does nothing. Known gaps — these look valid but are NOT in the bundle: `tw:line-through`, `tw:font-semibold`, `tw:font-bold`, `tw:font-medium`, `tw:grow`, `tw:truncate`, `tw:underline`, `tw:italic`, `tw:bg-white`, `tw:bg-*` (all background colors), `tw:text-*` (all text colors/sizes), `tw:border-*` (all border colors/widths). Confirmed present: `tw:aspect-square`, `tw:aspect-video`, `tw:object-cover`, `tw:object-contain`, `tw:shrink-0`. For any property not covered by a confirmed `tw:` class, use an inline `style=""` attribute instead. Spacing scale: `0.5`=2px · `1`=4px · `1.5`=6px · `2`=8px · `3`=12px · `4`=16px · `5`=20px · `6`=24px · `8`=32px.
- **`tw:lg:` prefix** applies at `min-width: 1024px`. Every base utility has a `lg:` twin — `tw:flex-col tw:lg:flex-row` means column on mobile, row on desktop.
- **Re-attach event listeners** after every `_render()` call — `innerHTML` replaces DOM and destroys existing listeners.
- **Escape user data** with `_escapeHtml()` before inserting into innerHTML.
- **`Affinity:refresh`** — dispatch this custom event on `document` after a mutation to tell the portal to reload other sections.
- Extensions are wrapped in a card by the portal by default. Only use `aff-card` when you need a card variation (e.g. a branded colour block) or multiple cards within a single extension. Use `aff-card-offer` (the nested card) when you need a distinct container that coexists with other elements inside a card.

---

## Registering with the Page Builder

Once your `.js` file is hosted:

1. Merchant portal → **Storefront** → **Customer portal** → theme → **Home page** → **Customize**
2. **Add a section** → **Custom extensions** → **Create a custom extension**
3. Enter the **File URL**, **Tag name** (must match `customElements.define` exactly), and **Extension name**
4. Save, add to a page column, and enable **Make this extension visible to customers**

Extensions start in test mode (preview only) until visibility is enabled.

---

## Reference files

- **[examples.md](references/examples.md)** — ready-to-use layout recipes (cross-sell, offer cards). Start here — pick the closest recipe and adapt it.
- **[sdk.md](references/sdk.md)** — Recharge JS SDK: authentication, common methods, and usage patterns.
- **[components.md](references/components.md)** — HTML snippet for every `aff-*` component class
- **[js-utilities.md](references/js-utilities.md)** — full source and data-attribute API for modal, toast, tabs, stepper
