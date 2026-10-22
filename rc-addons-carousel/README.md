# Add-ons Carousel

tag: `rc-addons-carousel`

Horizontally scrollable carousel of add-on products the customer can attach to one of their active subscriptions. Products come from Recharge's add-on parent/child setup, so only add-ons compatible with the selected parent subscription show up.

The element hides itself when the customer has no parent subscription, or when the parent has no compatible add-ons.

## What it does

1. Logs the customer in and loads their next queued charge plus their active subscriptions, in parallel
2. Treats subscriptions without an `addon_parent_subscription_id` as parents. If there's more than one, a dropdown lets the customer pick which one to shop add-ons for
3. Fetches add-ons with `productSearch` using `has_addon_plans: true` and the parent's variant ID in `parent_external_variant_ids`
4. Renders cards with image, name, variant name, price (with a struck-out compare-at price when discounted) and an Add button, with arrow buttons to scroll
5. Filters the cards client-side as the customer types in the search box
6. Shows `Added ✓` on load for products already in the next charge, and flips the button to `Adding…` then `Added ✓` on click
7. Dispatches `Affinity:refresh` after a successful add so the rest of the portal updates

## Configuration

| Constant | Description |
|---|---|
| `CARD_W` | Card width in pixels. Default: `168` |
| `CARD_GAP` | Gap between cards in pixels. Default: `12` |
| `HEADING` | Heading above the carousel. Default: `Add something extra to your next order` |
| `AFF_CSS` | Paste `AFF_CSS` from [`css-constants.js`](../css-constants.js) |
| `TW_CSS` | Paste `TW_CSS` from [`css-constants.js`](../css-constants.js) |

See the [main README](../README.md) for full setup instructions.

## How it works

On add, the extension calls `subscription.createSubscription` with `{ commit: true }`. The new subscription gets `addon_parent_subscription_id` set to the selected parent, copies the parent's charge and order interval, and is scheduled on the next queued charge's address and date. If the customer has no queued charge, the Add buttons stay disabled.

Switching parents in the dropdown re-runs the product search for that parent and shows skeleton cards while it loads.

## CSS constants note

`css-constants.js` in the repo root always has the latest versions of `AFF_CSS` and `TW_CSS`. Copy from there, and don't modify the constants in this file directly.
