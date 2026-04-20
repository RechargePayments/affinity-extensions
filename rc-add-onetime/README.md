# rc-add-onetime

Surfaces a single product as a one-time addition to the customer's next charge. The extension hides itself automatically if the item is already in the upcoming order.

## What it does

- Looks up the customer's next queued charge and fetches product info for the configured variant
- Shows the product image, title, price, and the scheduled charge date
- Adds the item as a one-time line item when the customer clicks "Add to order"
- Hides itself after a successful add and dispatches `Affinity:refresh` to update the rest of the portal
- Hides itself silently if the item is already in the upcoming order (no duplicate prompt)
- Shows an inline error state with a retry button on failure

## Screenshots

<!-- screenshot: idle state — product card with Add to order button -->

<!-- screenshot: loading state — button shows spinner and "Adding…" -->

<!-- screenshot: error state — inline error with retry button -->

## Configuration

Open `rc-add-onetime.js` and update the constants at the top of the file before deploying.

| Constant | What to put here |
|---|---|
| `VARIANT_ID` | The Shopify variant ID of the product to offer |
| `AFF_CSS` | Paste the `AFF_CSS` value from `css-constants.js` |
| `TW_CSS` | Paste the `TW_CSS` value from `css-constants.js` |

## CSS setup

Paste the contents of `AFF_CSS` and `TW_CSS` from [`css-constants.js`](../css-constants.js) directly into the matching constants at the top of `rc-add-onetime.js`. No hosting required.

Alternatively, host `skill/assets/aff-framework.css` and `skill/assets/tw.css` on your own CDN and swap the `<style>` injection in `connectedCallback` to `<link>` tags pointing to those URLs. The pattern is shown in `skill/SKILL.md`.

## How it works

On mount the extension authenticates via the Recharge JS SDK and fires two parallel requests: one to fetch the next queued charge (to get the address ID and scheduled date), and one to look up the product by variant ID. If the variant is already in the charge's line items the component hides itself and returns early. Otherwise it renders the product card. On add, it calls `createOnetime` with `{ commit: true }` so the change is applied to the queued charge immediately.

## Registration

Tag name: `rc-add-onetime`

1. Go to **Storefront → Customer portal → [theme] → Home page → Customize**
2. **Add a section → Custom extensions → Create a custom extension**
3. **Upload** `rc-add-onetime.js` directly in the dialog — it gets hosted in your Shopify store files and the URL is filled in automatically
4. Enter the tag name `rc-add-onetime` and a display name
5. Save, add to a page column, and enable **Make this extension visible to customers**

Alternatively, host the file in your Shopify theme assets (`{{ 'rc-add-onetime.js' | asset_url }}`), an S3 bucket, or any public URL, and paste the URL manually instead of uploading.
