# rc-swap-offer

Shows a personalised variant-swap offer to customers who have an active subscription on a specific product but are not yet on the target variant. One click updates their subscription.

## What it does

- Checks the customer's active subscriptions for the configured source product ID
- Hides itself silently if the customer is already on the target variant (or has no matching subscription)
- Shows the target variant's image, title, and price alongside configurable badge, heading, and body copy
- Calls `updateSubscription` to switch the variant when the customer clicks the CTA
- Hides itself after a successful swap and dispatches `Affinity:refresh` to update the portal
- Shows an inline error state with a retry button on failure

## Screenshots

<!-- screenshot: idle state — product image right, badge + heading + body + button left -->

<!-- screenshot: loading state — button shows spinner and "Switching…" -->

<!-- screenshot: error state — inline error alert with Try again button -->

## Configuration

Open `rc-swap-offer.js` and update the constants at the top of the file.

| Constant | What to put here |
|---|---|
| `SOURCE_PRODUCT_ID` | Shopify product ID of the subscription the customer is currently on |
| `TARGET_VARIANT_ID` | Shopify variant ID to swap the subscription to |
| `AFF_CSS` | Paste the `AFF_CSS` value from `css-constants.js` |
| `TW_CSS` | Paste the `TW_CSS` value from `css-constants.js` |

Also update the copy inside `_render()`. Search for `// CUSTOMIZE:` comments in the file — they mark the badge text, heading, body text, and button label.

## CSS setup

Paste the contents of `AFF_CSS` and `TW_CSS` from [`css-constants.js`](../css-constants.js) directly into the matching constants at the top of `rc-swap-offer.js`. No hosting required.

Alternatively, host `skill/assets/aff-framework.css` and `skill/assets/tw.css` on your own CDN and swap the `<style>` injection in `connectedCallback` to `<link>` tags. See `skill/SKILL.md` for the pattern.

## How it works

On mount the extension authenticates with the Recharge SDK and fetches the customer's active subscriptions. It looks for one where `external_product_id.ecommerce` matches `SOURCE_PRODUCT_ID` and `external_variant_id.ecommerce` is not already `TARGET_VARIANT_ID`. If none is found the extension hides itself and returns. Otherwise it fetches product details for `TARGET_VARIANT_ID` and renders the offer card. On confirmation it calls `updateSubscription` with `{ commit: true }` to apply the change immediately.

## Registration

Tag name: `rc-swap-offer`

1. Host `rc-swap-offer.js` on a publicly accessible URL
2. In the merchant portal go to **Storefront → Customer portal → [theme] → Home page → Customize**
3. **Add a section → Custom extensions → Create a custom extension**
4. Enter the file URL, tag name `rc-swap-offer`, and an extension name
5. Save, add to a page column, and enable **Make this extension visible to customers**
