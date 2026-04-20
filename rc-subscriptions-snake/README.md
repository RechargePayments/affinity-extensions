# Subscriptions Snake
tag: `rc-subscriptions-snake`

![](../screenshots/subscriptions-snake-desktop.png)

![](../screenshots/subscriptions-snake.png)

![](../screenshots/subscriptions-snake-reward.png)

A playable Snake mini-game that rewards customers with escalating subscription discounts as they clear progressively harder levels. Each level hides the reward behind a mystery card that's only revealed once the level is beaten.

## What it does

- Three levels of Snake, each unlocking a higher discount tier on completion
- Reward products are pulled live from the customer's Recharge catalog — no manual curation needed
- Completing a level reveals the reward product, shows the discounted price, and surfaces a copyable discount code
- Board adapts to screen width: side-by-side layout on wider screens, stacked on mobile
- Both arrow key and on-screen button controls are supported

## Configuration

| Constant | Description |
|---|---|
| `DISCOUNT_TIERS` | Human-readable reward labels shown in the UI, one per level |
| `DISCOUNT_CODES` | Discount codes customers copy, one per level |
| `DISCOUNT_PERCENTS` | Numeric percentages used to calculate the discounted price in the reward modal |
| `AFF_CSS` | Paste `AFF_CSS` from [`css-constants.js`](../css-constants.js) |
| `TW_CSS` | Paste `TW_CSS` from [`css-constants.js`](../css-constants.js) |

```js
const DISCOUNT_TIERS    = ['15% off', '25% off', '30% off'];
const DISCOUNT_CODES    = ['SAVE15', 'SAVE25', 'SAVE30'];
const DISCOUNT_PERCENTS = [15, 25, 30];
```

Search for `// BRAND:` comments to update store-specific copy (headings, progress text) and `// CUSTOMIZE:` for the collectible shape drawn on the game board.

`AFF_CSS` and `TW_CSS` hold the framework styles — copy them from [`css-constants.js`](../css-constants.js). See the [main README](../README.md) for full setup instructions.

## How it works

On mount the extension authenticates with the Recharge SDK and searches for up to 250 products. It filters for those that support both subscription and one-time purchase, shuffles the result, and picks the first three as level rewards. The game loop runs in a `setInterval` that calls `tick()` each frame — applying direction to the snake head, checking wall and self-collision, consuming the apple when reached, and transitioning to the reward phase once the per-level apple target is met. All state is held on the class instance and `render()` is called after every state change. The canvas is redrawn via the 2D API in `drawBoard()`.
