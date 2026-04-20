# Affinity Extensions

Reference implementations for the [Recharge Affinity Framework](./skill/SKILL.md) — copy-paste-ready custom extensions for the Recharge customer portal, styled to match your brand automatically via CSS design tokens.

## What's included

| Folder | Tag name | Description |
|---|---|---|
| [`rc-add-onetime/`](./rc-add-onetime/) | `rc-add-onetime` | Offer a single product as a one-time addition to the customer's next charge |
| [`rc-product-carousel/`](./rc-product-carousel/) | `rc-product-carousel` | Horizontally scrollable carousel of add-on products with tab filtering and a product detail modal |
| [`rc-swap-offer/`](./rc-swap-offer/) | `rc-swap-offer` | Personalized variant-swap offer for customers on a specific subscription product |
| [`subscriptions-snake/`](./subscriptions-snake/) | `subscriptions-snake` | Snake mini-game that unlocks escalating subscription discounts across three levels |

The `skill/` folder contains the Affinity Framework itself — documentation, CSS assets, component reference, layout recipes, and JS utilities. Treat it as read-only reference material.

---

## Quick start

### 1. Add the CSS

Each extension file contains two empty template literals at the top:

```js
const AFF_CSS = ``;  // required
const TW_CSS  = ``;  // required if the extension uses tw: classes (all four do)
```

Open [`css-constants.js`](./css-constants.js) in this repo and paste the full contents of `AFF_CSS` and `TW_CSS` into the matching constants in the extension file you want to use.

That's it — no hosting, no CDN dependency. The CSS is injected into the page via `<style>` tags the first time the component mounts.

**Alternative:** host `skill/assets/aff-framework.css` (and optionally `skill/assets/tw.css`) on your own CDN and inject them as `<link>` tags instead. See `skill/SKILL.md` for the exact pattern.

### 2. Configure store-specific values

Each extension has a config block near the top of the file. Minimum required changes:

| Extension | What to set |
|---|---|
| `rc-add-onetime` | `VARIANT_ID` |
| `rc-product-carousel` | `TAB_TAGS` and `TABS` (to match your Shopify product tags) |
| `rc-swap-offer` | `SOURCE_PRODUCT_ID` and `TARGET_VARIANT_ID` |
| `subscriptions-snake` | `DISCOUNT_TIERS`, `DISCOUNT_CODES`, `DISCOUNT_PERCENTS` |

Search each file for `// CUSTOMIZE:` and `// BRAND:` comments — they mark every value that's store-specific.

### 3. Host the file and register it

The Recharge page builder handles hosting for you — no separate CDN needed.

1. Go to **Storefront → Customer portal → [your theme] → Home page → Customize**
2. **Add a section → Custom extensions → Create a custom extension**
3. **Upload** the `.js` file directly in the dialog — it gets hosted in your Shopify store files automatically and the URL is filled in for you
4. Enter the tag name (e.g. `rc-add-onetime`) and give it a name
5. Save, drag it into the page, and toggle **Make this extension visible to customers**

**Alternatives for hosting the file:** Shopify theme assets (`{{ 'rc-add-onetime.js' | asset_url }}`), an S3 bucket, jsDelivr, or any other public URL — paste the URL manually in step 3 instead of uploading.

---

## Framework overview

Extensions are plain `HTMLElement` subclasses (no Shadow DOM). Styling uses two layers:

- **`aff-*` classes** — branding classes that reference Recharge CSS design tokens (colors, radius, font families). Applied by the portal automatically based on the merchant's theme.
- **`tw:` prefixed classes** — scoped Tailwind utilities for layout and spacing.

Both layers are in `skill/assets/`. The `css-constants.js` file at the root exports them as JS string constants so you can paste them directly into extension files without any build step.

Full API documentation: [`skill/SKILL.md`](./skill/SKILL.md)
Component reference: [`skill/references/components.md`](./skill/references/components.md)
Layout recipes: [`skill/references/examples.md`](./skill/references/examples.md)
JS utilities (modal, toast, tabs, stepper): [`skill/references/js-utilities.md`](./skill/references/js-utilities.md)
Recharge SDK reference: [`skill/references/sdk.md`](./skill/references/sdk.md)

---

## Folder structure

```
affinity-extensions/
├── README.md                        ← you are here
├── css-constants.js                 ← AFF_CSS and TW_CSS as copy-pasteable JS constants
├── skill/
│   ├── SKILL.md
│   ├── assets/
│   │   ├── aff-framework.css
│   │   └── tw.css
│   └── references/
│       ├── components.md
│       ├── examples.md
│       ├── js-utilities.md
│       └── sdk.md
├── rc-add-onetime/
│   ├── rc-add-onetime.js
│   └── README.md
├── rc-product-carousel/
│   ├── rc-product-carousel.js
│   └── README.md
├── rc-swap-offer/
│   ├── rc-swap-offer.js
│   └── README.md
└── subscriptions-snake/
    ├── subscriptions-snake.js
    └── README.md
```
