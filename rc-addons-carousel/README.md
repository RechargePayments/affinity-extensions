# Add-ons Carousel

tag: `rc-addons-carousel`

Horizontally scrollable carousel of add-on products the customer can attach to a parent subscription on their upcoming order. Products come from Recharge's add-on parent/child setup, so only add-ons compatible with the selected parent show up.

A subscription is in one of three states: standalone, parent, or child (an add-on, with `addon_parent_subscription_id` set). The element hides itself when there's no queued charge, or when none of the subscriptions on that charge are parents.

## What it does

1. Logs the customer in and loads their next queued charge plus their active subscriptions, in parallel
2. Takes every non-child subscription on that charge and runs `productSearch` for each, with `has_addon_plans: true` and the subscription's variant ID in `parent_external_variant_ids`
3. Keeps only the ones that come back with add-ons; those are the parents. Standalone subscriptions drop out. With more than one parent, a dropdown lets the customer pick which one to shop add-ons for
4. Renders cards with image, name, variant name, price (with a struck-out compare-at price when discounted), a quantity stepper and an action button, with arrow buttons to scroll
5. Filters the cards client-side as the customer types in the search box
6. For add-ons not on the order yet, the customer picks a quantity and clicks `Add`. For add-ons already on the upcoming order (the selected parent's child first, otherwise any subscription with that variant on the charge), the stepper starts at the current quantity, shows `In order ✓`, and switches to `Update` once the quantity changes
7. Dispatches `Affinity:refresh` after a successful add so the rest of the portal updates

## Configuration

| Constant | Description |
|---|---|
| `CARD_W` | Card width in pixels. Default: `168` |
| `CARD_GAP` | Gap between cards in pixels. Default: `12` |
| `HEADING` | Heading above the carousel. Default: `Add something extra to your next order` |
| `MAX_QTY` | Highest quantity the stepper allows. Default: `10` |
| `AFF_CSS` | Paste `AFF_CSS` from [`css-constants.js`](../css-constants.js) |
| `TW_CSS` | Paste `TW_CSS` from [`css-constants.js`](../css-constants.js) |

See the [main README](../README.md) for full setup instructions.

## How it works

On add, the extension calls `subscription.createSubscription` with `{ commit: true }`. The new subscription gets `addon_parent_subscription_id` set to the selected parent, copies the parent's charge and order interval, and is scheduled on the next queued charge's address and date. If the variant is already on the order, the extension never creates a second subscription for it; it calls `subscription.updateSubscription` with the new `quantity` instead. The stepper bottoms out at 1, so removing an add-on still happens elsewhere in the portal.

Add-ons for every parent are fetched up front, so switching parents in the dropdown is instant.

## CSS constants note

`css-constants.js` in the repo root always has the latest versions of `AFF_CSS` and `TW_CSS`. Copy from there, and don't modify the constants in this file directly.
