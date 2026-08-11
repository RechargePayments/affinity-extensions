// ─── CSS setup ───────────────────────────────────────────────────────────────
// Paste the contents of AFF_CSS from css-constants.js (repo root) here.
// Alternative: host skills/affinity-framework/assets/aff-framework.css on your own CDN and
// inject it as a <link> tag instead. See skills/affinity-framework/SKILL.md for both patterns.
const AFF_CSS = ``;

// Paste the contents of TW_CSS from css-constants.js here (optional —
// only needed if you use tw: layout classes, which this extension does).
const TW_CSS = ``;

// ─── Configure these for your store ──────────────────────────────────────────

const TAG_NAME = 'rc-subscriptions-snake';

// CUSTOMIZE: Discount tiers unlocked by completing each level.
// Index 0 = Level 1 reward, 1 = Level 2, 2 = Level 3.
const DISCOUNT_TIERS    = ['15% off', '25% off', '30% off'];
const DISCOUNT_CODES    = ['CODE15', 'CODE25', 'CODE30'];  // CUSTOMIZE: your actual discount codes
const DISCOUNT_PERCENTS = [15, 25, 30];

const RECHARGE_SDK_URL  = 'https://static.rechargecdn.com/assets/storefront/recharge-client-1.81.0.min.js';
const RECHARGE_APP_NAME = TAG_NAME; // matches customElements.define tag name

let rechargeSdkPromise;

const LEVELS = [
  { speed: 180, apples: 4, gridSize: 12, walls: [] },
  {
    speed: 125,
    apples: 6,
    gridSize: 13,
    walls: [
      [6, 3], [6, 4], [6, 5], [6, 7], [6, 8], [6, 9],
    ],
  },
  {
    speed: 90,
    apples: 8,
    gridSize: 14,
    walls: [
      [4, 4], [4, 5], [4, 6], [4, 7], [4, 8],
      [9, 5], [9, 6], [9, 7], [9, 8], [9, 9],
      [6, 10], [7, 10], [8, 10],
    ],
  },
];

const GAME_CSS = `
  .snake-board {
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--recharge-corners-radius);
    display: block;
  }

  .snake-badge-brand {
    background: var(--recharge-button-brand) !important;
    color: var(--recharge-button-color) !important;
  }

  subscriptions-snake {
    container-type: inline-size;
    display: block;
  }

  .snake-layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @container (min-width: 600px) {
    .snake-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: start;
    }
  }
`;

// ─── Pure helpers ─────────────────────────────────────────────────────────────

const randomInt = (max) => Math.floor(Math.random() * max);

const keyForCell = (x, y) => `${x}:${y}`;

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const canPlaceSnake = (level, segments) => {
  const occupiedWalls = new Set(level.walls.map(([x, y]) => keyForCell(x, y)));
  return segments.every((segment, index) => {
    const inBounds =
      segment.x >= 0 &&
      segment.y >= 0 &&
      segment.x < level.gridSize &&
      segment.y < level.gridSize;
    if (!inBounds) return false;
    if (occupiedWalls.has(keyForCell(segment.x, segment.y))) return false;
    return !segments.some((other, otherIndex) => {
      if (index === otherIndex) return false;
      return other.x === segment.x && other.y === segment.y;
    });
  });
};

const buildSafeSnakeForLevel = (level, length) => {
  const safeLength = Math.max(2, length);
  const horizontalLength = Math.min(safeLength, Math.max(2, level.gridSize - 2));
  const centerY = Math.floor(level.gridSize / 2);
  const candidateRows = [centerY, centerY - 1, centerY + 1, centerY - 2, centerY + 2];

  for (const row of candidateRows) {
    if (row < 0 || row >= level.gridSize) continue;
    const startX = Math.max(1, Math.floor((level.gridSize - horizontalLength) / 2));
    const segments = Array.from({ length: horizontalLength }, (_, index) => ({
      x: startX + index,
      y: row,
    })).reverse();
    if (canPlaceSnake(level, segments)) {
      return { snake: segments, direction: 'right' };
    }
  }

  for (let y = 0; y < level.gridSize; y += 1) {
    for (let x = 1; x <= level.gridSize - horizontalLength - 1; x += 1) {
      const segments = Array.from({ length: horizontalLength }, (_, index) => ({
        x: x + index,
        y,
      })).reverse();
      if (canPlaceSnake(level, segments)) {
        return { snake: segments, direction: 'right' };
      }
    }
  }

  return {
    snake: [
      { x: 2, y: centerY },
      { x: 1, y: centerY },
    ],
    direction: 'right',
  };
};

// ─── SDK helpers ──────────────────────────────────────────────────────────────

const loadRechargeSdk = async () => {
  if (!rechargeSdkPromise) {
    rechargeSdkPromise = (async () => {
      if (!window.recharge) {
        await new Promise((resolve, reject) => {
          const existing = document.querySelector(`script[src="${RECHARGE_SDK_URL}"]`);
          if (existing) {
            existing.addEventListener('load', resolve, { once: true });
            existing.addEventListener('error', () => reject(new Error('Failed to load Recharge SDK')), { once: true });
            return;
          }
          const script = document.createElement('script');
          script.src = RECHARGE_SDK_URL;
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Recharge SDK'));
          document.head.appendChild(script);
        });
        window.recharge.init({ appName: RECHARGE_APP_NAME });
      }
    })();
  }
  return rechargeSdkPromise;
};

const formatPrice = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  return `$${amount.toFixed(2)}`;
};

const getOneTimePrice = (product) => {
  const minimumPrice = product?.minimum_variant_prices?.find((entry) => Number(entry?.price) > 0);
  if (minimumPrice) return minimumPrice.price;
  if (Array.isArray(product?.variants)) {
    for (const variant of product.variants) {
      const prices = Array.isArray(variant?.prices) ? variant.prices : [];
      const defaultPrice = prices.find((entry) => Number(entry?.unit_price) > 0);
      if (defaultPrice) return defaultPrice.unit_price;
    }
  }
  return null;
};

const normalizeProductForReward = (product, index) => {
  const firstVariant = Array.isArray(product?.variants) ? product.variants[0] : null;
  const firstPlan = Array.isArray(product?.plans)
    ? product.plans.find((plan) => plan?.type === 'subscription') || product.plans[0]
    : null;
  const rawImage = product?.images?.[0]?.medium
    || product?.images?.[0]?.large
    || product?.images?.[0]?.small
    || product?.image?.src
    || product?.featured_image
    || null;
  const image = rawImage
    ? (String(rawImage).startsWith('//') ? `https:${rawImage}` : rawImage)
    : null;
  const rawOneTimePrice = getOneTimePrice(product) ?? firstVariant?.prices?.[0]?.unit_price;
  const discountPercent = DISCOUNT_PERCENTS[index] || 0;
  const oneTimePrice = formatPrice(rawOneTimePrice);
  const discountedOneTimePrice = rawOneTimePrice != null
    ? formatPrice(Number(rawOneTimePrice) * (1 - discountPercent / 100))
    : null;
  const subscriptionPrice = formatPrice(firstPlan?.price ?? firstPlan?.price_adjustments?.[0]?.price);
  return {
    level: index + 1,
    title: product?.title || `Reward ${index + 1}`,
    subtitle: product?.product_type || '',
    discount: DISCOUNT_CODES[index],
    discountLabel: DISCOUNT_TIERS[index],
    discountPercent,
    image,
    oneTimePrice,
    discountedOneTimePrice,
    subscriptionPrice,
  };
};

const supportsOneTimeAndSubscription = (product) => {
  const hasOneTime = Number(getOneTimePrice(product)) > 0;
  const hasSubscription = Array.isArray(product?.plans) && product.plans.some((plan) => {
    if (plan?.type === 'subscription') return true;
    return Boolean(
      plan?.subscription_preferences?.interval_unit &&
      plan?.subscription_preferences?.order_interval_frequency
    );
  });
  return hasOneTime && hasSubscription;
};

const fetchRewardProducts = async () => {
  await loadRechargeSdk();
  const rc = window.recharge;
  const session = await rc.auth.loginCustomerPortal();
  const productSearch = rc.product?.productSearch || rc.productSearch;
  if (typeof productSearch !== 'function') {
    throw new Error('Recharge product.productSearch is not available');
  }
  const response = await productSearch(session, { limit: 250, format_version: '2022-06' });
  const products = Array.isArray(response?.products) ? response.products : [];
  const eligible = shuffle(products.filter(supportsOneTimeAndSubscription)).slice(0, 3);
  if (eligible.length < 3) {
    throw new Error('Could not find three Recharge products that support one-time and subscription purchase.');
  }
  return eligible.map((product, index) => normalizeProductForReward(product, index));
};

// ─── SVG icons ────────────────────────────────────────────────────────────────

const ICON_INFO = `<svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="5.5" fill="currentColor" r="1"/><path d="M9 8.5v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const ICON_SUCCESS = `<svg viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="13" aria-hidden="true"><path d="M14.5 1 4.967 12 1.5 8.333" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const ICON_ERROR = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="m10.423 5.577-4.846 4.846M5.577 5.577l4.846 4.846M8 15.429A7.429 7.429 0 1 0 8 .57 7.429 7.429 0 0 0 8 15.43Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const ICON_TAG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`;

// ─── Web Component ─────────────────────────────────────────────────────────────

class SubscriptionsSnake extends HTMLElement {
  connectedCallback() {
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
    if (!document.querySelector('#snake-game-css')) {
      const s = document.createElement('style');
      s.id = 'snake-game-css';
      s.textContent = GAME_CSS;
      document.head.appendChild(s);
    }

    this.state = {
      levelIndex: 0,
      phase: 'intro',
      applesEaten: 0,
      highestUnlocked: 0,
      selectedReward: null,
      rewardProducts: [],
      productsStatus: 'loading',
    };
    this.intervalId = null;
    this.direction = 'right';
    this.nextDirection = 'right';
    this.handleKeydown = this.onKeydown.bind(this);
    this.render();
    void this.loadRewardProducts();
    window.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKeydown);
    if (this.intervalId) clearInterval(this.intervalId);
  }

  async loadRewardProducts() {
    try {
      const rewardProducts = await fetchRewardProducts();
      this.state.rewardProducts = rewardProducts;
      this.state.productsStatus = 'ready';
      this.initLevel(0);
      this.render();
    } catch (error) {
      this.state.productsStatus = 'failed';
      this.state.errorMessage = error instanceof Error
        ? error.message
        : (error?.error ?? error?.message ?? JSON.stringify(error));
      this.render();
    }
  }

  initLevel(levelIndex) {
    const level = LEVELS[levelIndex];
    const center = Math.floor(level.gridSize / 2);
    this.level = level;
    this.direction = 'right';
    this.nextDirection = 'right';
    this.snake = [
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ];
    this.apple = this.placeApple();
    this.state.levelIndex = levelIndex;
    this.state.applesEaten = 0;
    this.state.selectedReward = this.state.rewardProducts[levelIndex] || null;
    this.state.phase = 'intro';
  }

  placeApple() {
    const occupied = new Set([
      ...this.snake.map((segment) => keyForCell(segment.x, segment.y)),
      ...this.level.walls.map(([x, y]) => keyForCell(x, y)),
    ]);
    let x = 0;
    let y = 0;
    do {
      x = randomInt(this.level.gridSize);
      y = randomInt(this.level.gridSize);
    } while (occupied.has(keyForCell(x, y)));
    return { x, y };
  }

  startLevel() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.state.phase = 'playing';
    this.intervalId = setInterval(() => {
      this.tick();
      this.render();
    }, this.level.speed);
    this.render();
  }

  tick() {
    this.direction = this.nextDirection;
    const head = this.snake[0];
    const nextHead = { ...head };
    if (this.direction === 'up') nextHead.y -= 1;
    if (this.direction === 'down') nextHead.y += 1;
    if (this.direction === 'left') nextHead.x -= 1;
    if (this.direction === 'right') nextHead.x += 1;

    const hitWall =
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= this.level.gridSize ||
      nextHead.y >= this.level.gridSize ||
      this.level.walls.some(([x, y]) => x === nextHead.x && y === nextHead.y) ||
      this.snake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

    if (hitWall) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.state.phase = 'lost';
      return;
    }

    this.snake.unshift(nextHead);

    if (nextHead.x === this.apple.x && nextHead.y === this.apple.y) {
      this.state.applesEaten += 1;
      if (this.state.applesEaten >= this.level.apples) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.state.phase = 'reward';
        this.state.highestUnlocked = Math.max(this.state.highestUnlocked, this.state.levelIndex + 1);
        return;
      }
      this.apple = this.placeApple();
    } else {
      this.snake.pop();
    }
  }

  onKeydown(event) {
    const keyMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    const next = keyMap[event.key];
    if (!next) return;
    event.preventDefault();
    event.stopPropagation();
    const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
    if (opposites[this.direction] === next) return;
    this.nextDirection = next;
    if (this.state.phase === 'intro') {
      this.startLevel();
    }
  }

  setDirection(direction) {
    const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
    if (opposites[this.direction] === direction) return;
    this.nextDirection = direction;
  }

  continueGame() {
    if (this.state.levelIndex >= LEVELS.length - 1) {
      this.state.phase = 'finished';
      this.render();
      return;
    }
    const nextLevelIndex = this.state.levelIndex + 1;
    const nextLevel = LEVELS[nextLevelIndex];
    if (!nextLevel) return;
    const safePlacement = buildSafeSnakeForLevel(nextLevel, this.snake.length);
    this.level = nextLevel;
    this.snake = safePlacement.snake;
    this.state.levelIndex = nextLevelIndex;
    this.state.applesEaten = 0;
    this.state.selectedReward = this.state.rewardProducts[nextLevelIndex] || null;
    this.state.phase = 'playing';
    this.direction = safePlacement.direction;
    this.nextDirection = safePlacement.direction;
    this.apple = this.placeApple();
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.tick();
      this.render();
    }, this.level.speed);
    this.render();
  }

  restartLevel() {
    this.initLevel(this.state.levelIndex);
    this.render();
  }

  claimReward() {
    const reward = this.state.selectedReward || this.state.rewardProducts[this.state.levelIndex] || null;
    if (!reward) return;
    this.state.phase = 'claimed';
    this.render();
  }

  drawBoard() {
    const canvas = this.querySelector('#snake-board');
    if (!canvas) return;
    const displaySize = canvas.offsetWidth;
    if (displaySize > 0) {
      canvas.width = displaySize;
      canvas.height = displaySize;
    }
    const ctx = canvas.getContext('2d');
    const size = this.level.gridSize;
    const cell = canvas.width / size;

    const cs = getComputedStyle(this);
    const brand     = (cs.getPropertyValue('--recharge-button-brand').trim()     || '#E76305').replace(/\s/g, '');
    const secondary = (cs.getPropertyValue('--recharge-button-secondary').trim() || '#575c3d').replace(/\s/g, '');

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = brand;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        ctx.globalAlpha = (x + y) % 2 === 0 ? 0.06 : 0.14;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = brand;
    this.level.walls.forEach(([x, y]) => {
      ctx.fillRect(x * cell, y * cell, cell, cell);
    });

    // BRAND: collectible shape drawn on the board.
    // This example draws a bone (fitting for a pet store).
    // For a generic store, replace with a simple circle:
    //   ctx.beginPath(); ctx.arc(bx, by, cell * 0.28, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = brand;
    const bx = this.apple.x * cell + cell / 2;
    const by = this.apple.y * cell + cell / 2;
    const halfLen = cell * 0.30;
    const halfW   = cell * 0.09;
    const knobR   = cell * 0.13;
    const knobOff = cell * 0.10;
    ctx.fillRect(bx - halfLen, by - halfW, halfLen * 2, halfW * 2);
    [[bx - halfLen, by - knobOff], [bx - halfLen, by + knobOff],
     [bx + halfLen, by - knobOff], [bx + halfLen, by + knobOff]].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, knobR, 0, Math.PI * 2);
      ctx.fill();
    });

    this.snake.forEach((segment, index) => {
      ctx.globalAlpha = index === 0 ? 1 : 0.5;
      ctx.fillStyle = secondary;
      ctx.fillRect(segment.x * cell + 1, segment.y * cell + 1, cell - 2, cell - 2);
    });

    ctx.globalAlpha = 1;
  }

  // ─── Render helpers ──────────────────────────────────────────────────────────

  _escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  }

  _renderRewardPreviewCard() {
    const reward = this.state.selectedReward;
    if (!reward) return '';
    const { phase, levelIndex, applesEaten } = this.state;
    const level = LEVELS[levelIndex];
    const remaining = level.apples - applesEaten;

    const mysteryImageHtml = `
      <div class="aff-img aff-img-sm tw:aspect-square tw:flex tw:items-center tw:justify-center tw:shrink-0" style="background:var(--recharge-color-neutral-10);border-radius:var(--recharge-corners-radius)">
        <span style="font-size:1.25rem;line-height:1">?</span>
      </div>`;

    // BRAND: update progress text to match your store's theme.
    // "items" is a safe generic term; replace with something more specific if relevant.
    const progressHtml = phase === 'playing'
      ? `<div class="aff-alert aff-alert-info tw:bg-white" role="status">${ICON_INFO}<p class="aff-text-body aff-text-sm">${remaining} more item${remaining !== 1 ? 's' : ''} to unlock this reward.</p></div>`
      : `<div class="aff-alert aff-alert-info tw:bg-white" role="status">${ICON_INFO}<p class="aff-text-body aff-text-sm">Collect ${level.apples} items to unlock this reward.</p></div>`;

    const ctaHtml = phase === 'intro'
      ? `<button class="recharge-button aff-btn aff-btn-primary aff-btn-sm" type="button" data-action="start-level">Start level ${levelIndex + 1}</button>`
      : '';

    return `
      <div class="aff-card-offer tw:flex tw:flex-col tw:gap-3">
        <p class="aff-h4 aff-text-heading">Level ${levelIndex + 1} reward</p>
        <div class="tw:flex tw:gap-4 tw:items-center">
          ${mysteryImageHtml}
          <div class="tw:flex tw:flex-col tw:gap-1">
            <h3 class="aff-h3 aff-text-heading">Mystery reward</h3>
            <p class="aff-text-body aff-text-sm aff-text-muted">Complete the level to reveal.</p>
          </div>
        </div>
        ${progressHtml}
        ${ctaHtml}
      </div>
    `;
  }

  _renderRewardModal() {
    const reward = this.state.selectedReward;
    if (!reward) return '';
    const finalLevel = this.state.levelIndex === LEVELS.length - 1;
    const imageHtml = reward.image
      ? `<img class="aff-img aff-img-md tw:aspect-square tw:object-cover tw:shrink-0" src="${this._escapeHtml(reward.image)}" alt="${this._escapeHtml(reward.title)}" />`
      : '';
    const priceHtml = reward.oneTimePrice && reward.discountedOneTimePrice
      ? `<div class="tw:flex tw:items-center tw:gap-2 tw:flex-wrap">
           <span class="aff-text-body aff-text-sm aff-text-muted" style="text-decoration:line-through">${this._escapeHtml(reward.oneTimePrice)}</span>
           <span class="aff-text-body aff-text-sm" style="font-weight:600">${this._escapeHtml(reward.discountedOneTimePrice)}</span>
           <span class="aff-badge snake-badge-brand">${this._escapeHtml(reward.discountLabel)}</span>
         </div>`
      : reward.oneTimePrice
        ? `<p class="aff-text-body aff-text-sm">${this._escapeHtml(reward.oneTimePrice)}</p>`
        : '';

    const subtitleHtml = reward.subtitle
      ? `<p class="aff-text-body aff-text-sm aff-text-muted">${this._escapeHtml(reward.subtitle)}</p>`
      : '';

    return `
      <div class="aff-modal-wrapper is-open">
        <div class="aff-modal">
          <div class="aff-modal-header">
            <h2 class="aff-h2 aff-text-heading">Reward unlocked</h2>
          </div>
          <div class="aff-card-offer tw:flex tw:flex-col tw:gap-3">
            <p class="aff-text-body aff-text-sm aff-text-muted">Level ${this.state.levelIndex + 1} complete</p>
            <div class="tw:flex tw:gap-4 tw:items-center">
              ${imageHtml}
              <div class="tw:flex tw:flex-col tw:gap-1">
                <h3 class="aff-h3 aff-text-heading">${this._escapeHtml(reward.title)}</h3>
                ${subtitleHtml}
                ${priceHtml}
              </div>
            </div>
          </div>
          <div class="tw:flex tw:flex-col tw:gap-2">
            <button class="recharge-button aff-btn aff-btn-primary aff-btn-full" type="button" data-action="claim">Claim reward &amp; reveal code</button>
            ${finalLevel ? '' : '<button class="recharge-button aff-btn aff-btn-tertiary aff-btn-full" type="button" data-action="continue">Continue playing</button>'}
          </div>
        </div>
      </div>
    `;
  }

  renderState() {
    const { phase, levelIndex, selectedReward } = this.state;

    if (phase === 'reward') {
      return this._renderRewardModal();
    }

    if (phase === 'claimed') {
      const reward = selectedReward;
      const imageHtml = reward?.image
        ? `<img class="aff-img aff-img-sm tw:aspect-square tw:object-cover tw:shrink-0" src="${this._escapeHtml(reward.image)}" alt="${this._escapeHtml(reward.title)}" />`
        : '';
      const hasNext = levelIndex < LEVELS.length - 1;
      return `
        <div class="aff-card-offer tw:flex tw:flex-col tw:gap-3">
          <div class="tw:flex tw:items-center tw:gap-2">
            <span class="aff-badge snake-badge-brand">${this._escapeHtml(reward.discountLabel)}</span>
            <p class="aff-text-body aff-text-sm">Reward claimed</p>
          </div>
          <div class="tw:flex tw:gap-4 tw:items-center">
            ${imageHtml}
            <div class="tw:flex tw:flex-col tw:gap-1">
              <h3 class="aff-h3 aff-text-heading">${this._escapeHtml(reward.title)}</h3>
              <p class="aff-text-body aff-text-sm aff-text-muted">${this._escapeHtml(reward.subtitle)}</p>
            </div>
          </div>
          <div class="aff-callout">
            ${ICON_TAG}
            <p class="aff-text-body aff-text-sm">Your discount code: <strong>${this._escapeHtml(reward.discount)}</strong></p>
          </div>
          <div class="tw:flex tw:gap-2">
            ${hasNext
              ? '<button class="recharge-button aff-btn aff-btn-primary aff-btn-sm" type="button" data-action="continue">Continue to next level</button>'
              : '<button class="recharge-button aff-btn aff-btn-primary aff-btn-sm" type="button" data-action="restart-all">Play again</button>'}
          </div>
        </div>
      `;
    }

    if (phase === 'finished') {
      return `
        <div class="aff-alert aff-alert-success" role="status">
          ${ICON_SUCCESS}
          <div class="tw:flex tw:flex-col tw:gap-3">
            <p class="aff-text-body aff-text-sm">You cleared all three levels and unlocked every subscription offer.</p>
            <div>
              <button class="recharge-button aff-btn aff-btn-primary aff-btn-sm" type="button" data-action="restart-all">Play again</button>
            </div>
          </div>
        </div>
      `;
    }

    if (phase === 'lost') {
      return `
        <div class="aff-alert aff-alert-error" role="alert">
          ${ICON_ERROR}
          <div class="tw:flex tw:flex-col tw:gap-3">
            <p class="aff-text-body aff-text-sm">You clipped the wall or your own tail.</p>
            <div class="tw:flex tw:gap-2 tw:flex-wrap">
              <button class="recharge-button aff-btn aff-btn-primary aff-btn-sm" type="button" data-action="retry-level">Retry level</button>
              <button class="recharge-button aff-btn aff-btn-tertiary aff-btn-sm" type="button" data-action="restart-all">Restart run</button>
            </div>
          </div>
        </div>
      `;
    }

    return this._renderRewardPreviewCard();
  }

  bindEvents() {
    this.querySelector('[data-action="start-level"]')?.addEventListener('click', () => this.startLevel());
    this.querySelector('[data-action="retry-level"]')?.addEventListener('click', () => this.restartLevel());
    this.querySelector('[data-action="restart-all"]')?.addEventListener('click', () => {
      this.initLevel(0);
      this.render();
    });
    this.querySelector('[data-action="continue"]')?.addEventListener('click', () => this.continueGame());
    this.querySelector('[data-action="claim"]')?.addEventListener('click', () => this.claimReward());
    this.querySelector('[data-direction="up"]')?.addEventListener('click', () => this.setDirection('up'));
    this.querySelector('[data-direction="down"]')?.addEventListener('click', () => this.setDirection('down'));
    this.querySelector('[data-direction="left"]')?.addEventListener('click', () => this.setDirection('left'));
    this.querySelector('[data-direction="right"]')?.addEventListener('click', () => this.setDirection('right'));
  }

  render() {
    if (this.state.productsStatus === 'loading') {
      this.innerHTML = `
        <div class="tw:flex tw:flex-col tw:gap-4">
          <div class="tw:flex tw:flex-col tw:gap-2">
            <!-- BRAND: update title and description to match store voice -->
            <h2 class="aff-h2 aff-text-heading">Play to unlock rewards</h2>
            <p class="aff-text-body aff-text-sm aff-text-muted">Loading reward products…</p>
          </div>
        </div>
      `;
      return;
    }

    if (this.state.productsStatus === 'failed') {
      this.innerHTML = `
        <div class="tw:flex tw:flex-col tw:gap-4">
          <!-- BRAND: update title to match store voice -->
          <h2 class="aff-h2 aff-text-heading">Play to unlock rewards</h2>
          <div class="aff-alert aff-alert-error" role="alert">
            ${ICON_ERROR}
            <p class="aff-text-body aff-text-sm">${this._escapeHtml(this.state.errorMessage || 'Failed to load reward products.')}</p>
          </div>
        </div>
      `;
      return;
    }

    this.innerHTML = `
      <div class="tw:flex tw:flex-col tw:gap-4">
        <div class="tw:flex tw:flex-col tw:gap-1">
          <!-- BRAND: update title and description to match store voice -->
          <h2 class="aff-h2 aff-text-heading">Play to unlock rewards</h2>
          <p class="aff-text-body aff-text-sm aff-text-muted">Complete three levels to uncover a mystery subscription reward.</p>
        </div>

        <div class="snake-layout">
          <div>
            <canvas id="snake-board" class="snake-board" width="320" height="320"></canvas>
          </div>
          <div>
            ${this.renderState()}
          </div>
        </div>
      </div>
    `;

    this.drawBoard();
    this.bindEvents();
  }

  refresh() {
    this.state = {
      levelIndex: 0,
      phase: 'intro',
      applesEaten: 0,
      highestUnlocked: 0,
      selectedReward: null,
      rewardProducts: [],
      productsStatus: 'loading',
    };
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.render();
    void this.loadRewardProducts();
  }
}

customElements.define(TAG_NAME, SubscriptionsSnake);
export default SubscriptionsSnake;
