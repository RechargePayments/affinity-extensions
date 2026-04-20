# Product Carousel
tag: `rc-product-carousel`

![](../screenshots/carousel-all.png)

A horizontally scrollable product carousel with tab filtering that lets customers browse your catalog and add any item as a one-time addition to their next charge. Tapping a product opens a detail modal with a full image gallery and description before they commit.

## What it does

- Products are grouped into tabs by Shopify tag, plus an "All" tab that always shows everything
- Customers scroll the carousel left/right and tap a product image to open its detail modal
- Items already in the upcoming charge show "Added ✓" and can't be added again
- Adding an item from either the carousel or the modal updates the next charge immediately

## Configuration

| Constant | Description |
|---|---|
| `TAB_TAGS` | Maps tab keys to Shopify product tag strings |
| `TABS` | Ordered list of `{ key, label }` objects shown as tabs in the UI |
| `AFF_CSS` | Paste `AFF_CSS` from [`css-constants.js`](../css-constants.js) |
| `TW_CSS` | Paste `TW_CSS` from [`css-constants.js`](../css-constants.js) |

```js
const TAB_TAGS = {
  food:        'dog-food',
  treats:      'treats',
  accessories: 'accessories',
};

const TABS = [
  { key: 'all',         label: 'All' },
  { key: 'food',        label: 'Food' },
  { key: 'treats',      label: 'Treats' },
  { key: 'accessories', label: 'Accessories' },
];
```

Search for `// CUSTOMIZE` comments to update the `#products` initial state and the `refresh()` reset to match your tab keys.

`AFF_CSS` and `TW_CSS` hold the framework styles — copy them from [`css-constants.js`](../css-constants.js). See the [main README](../README.md) for full setup instructions.

## How it works

On mount the extension authenticates with the Recharge SDK and fires two parallel requests: a product search (up to 50 products) and a fetch of the next queued charge. Tab filtering is applied client-side by matching product tags against `TAB_TAGS`. Already-added variants are tracked in a `Set` and reflected on card buttons without a full re-render — only the carousel track re-renders on tab changes. The detail modal is built on demand and removed from the DOM after its close animation completes.
