# Component Reference

## Typography

Always pair a size class with `aff-text-heading` (for headings) or `aff-text-body` (for body copy).

```html
<!-- Headings — pair with aff-text-heading -->
<h1 class="aff-display-1 aff-text-heading">Display 1</h1>
<h1 class="aff-display-2 aff-text-heading">Display 2</h1>
<h1 class="aff-h1 aff-text-heading">Heading 1</h1>
<h2 class="aff-h2 aff-text-heading">Heading 2</h2>
<h3 class="aff-h3 aff-text-heading">Heading 3</h3>
<h4 class="aff-h4 aff-text-heading">Heading 4</h4>

<!-- Body copy — pair with aff-text-body -->
<p class="aff-text-body aff-text-base">Regular body text</p>
<p class="aff-text-body aff-text-sm">Small body text</p>
<p class="aff-text-body aff-text-sm aff-text-muted">Small muted text</p>

<!-- Strikethrough price pattern -->
<p class="aff-text-body aff-text-base">
  <span class="aff-text-muted tw:line-through">$30.00</span>
  &nbsp;$27.00
</p>
```


## Buttons & links

```html
<!-- Always include recharge-button to prevent portal style overrides -->
<button class="recharge-button aff-btn aff-btn-primary">Primary</button>
<button class="recharge-button aff-btn aff-btn-secondary">Secondary</button>
<button class="recharge-button aff-btn aff-btn-tertiary">Tertiary / cancel</button>

<!-- Size & width modifiers -->
<button class="recharge-button aff-btn aff-btn-primary aff-btn-sm">Small</button>
<button class="recharge-button aff-btn aff-btn-primary aff-btn-full">Full width</button>

<!-- Icon button (carousel arrows) -->
<button class="recharge-button aff-btn aff-btn-secondary aff-btn-icon" aria-label="Previous">
  <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.726 2.972L0.484 2.972M0.484 2.972L2.972 0.484M0.484 2.972L2.972 5.46" stroke="currentColor" stroke-width="0.968" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>
<button class="recharge-button aff-btn aff-btn-secondary aff-btn-icon" aria-label="Next">
  <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.484 2.972H9.726" stroke="currentColor" stroke-width="0.968" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.238 5.46L9.726 2.972L7.238 0.484" stroke="currentColor" stroke-width="0.968" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>

<!-- Link -->
<a class="recharge-button aff-link" href="#">Link text</a>
```


## Image

`aff-img` applies the merchant's corner radius and `display: block`.

```html
<img class="aff-img" src="product.jpg" alt="Product name" />

<!-- Fixed size (use inline style for dimensions, aff-img for radius) -->
<img class="aff-img aff-img-md tw:aspect-square tw:object-cover tw:shrink-0" src="product.jpg" alt="Product" />
```


## Form elements

### Input
```html
<div class="tw:flex tw:flex-col tw:gap-2">
  <label class="aff-text-body aff-text-base" for="my-input">Label</label>
  <div class="aff-input">
    <input id="my-input" type="text" placeholder="Placeholder" />
  </div>
</div>
```

### Select
```html
<div class="tw:flex tw:flex-col tw:gap-2">
  <label class="aff-text-body aff-text-base" for="my-select">Label</label>
  <div class="aff-select">
    <select id="my-select">
      <option>Option 1</option>
      <option>Option 2</option>
    </select>
    <span class="aff-select-chevron">
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </div>
</div>
```

### Radio buttons
```html
<div class="tw:flex tw:flex-col tw:gap-3">
  <label class="aff-radio-option">
    <input type="radio" name="group" value="a" />
    <span class="aff-text-body aff-text-base">Option A</span>
  </label>
  <label class="aff-radio-option">
    <input type="radio" name="group" value="b" />
    <span class="aff-text-body aff-text-base">Option B</span>
  </label>
</div>
```

### Toggle
```html
<label class="aff-toggle">
  <input type="checkbox" />
  <span class="aff-toggle-track"></span>
  <span class="aff-text-body aff-text-base">Toggle label</span>
</label>
```

### Stepper
Copy the `initStepper` source from [js-utilities.md](js-utilities.md) into the extension and call `initStepper(this)` after render.
```html
<div class="aff-stepper">
  <button class="recharge-button" aria-label="Decrease" data-stepper-dec>
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <path d="M8 15.429A7.429 7.429 0 1 0 8 .57 7.429 7.429 0 0 0 8 15.43ZM4.571 8h6.858" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
  <input type="number" data-stepper-val value="1" min="1" max="99" />
  <button class="recharge-button" aria-label="Increase" data-stepper-inc>
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <path d="M8 15.429A7.429 7.429 0 1 0 8 .57 7.429 7.429 0 0 0 8 15.43ZM8 4.571v6.858M4.571 8h6.858" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</div>
```


## Cards

The portal wraps each extension in a card by default. Only use `aff-card` when you need a card variation (e.g. a branded colour block) or multiple cards within a single extension. Use `aff-card-offer` when you need a distinct container that coexists with other elements inside a card.

```html
<!-- Branded colour card (e.g. hero/callout) -->
<div class="aff-card" style="background-color: var(--recharge-button-brand); color: var(--recharge-button-color);">
  content
</div>

<!-- Nested offer card (subdued background, border) -->
<div class="aff-card-offer">
  content
</div>
```


## Badges

```html
<span class="aff-badge">Neutral</span>
<span class="aff-badge aff-badge-warning">Warning</span>
```


## Alerts

```html
<div class="aff-alert aff-alert-info" role="status">
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="5.5" fill="currentColor" r="1"/><path d="M9 8.5v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <p class="aff-text-body aff-text-sm">Informational message.</p>
</div>

<div class="aff-alert aff-alert-success" role="status">
  <svg viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="13" aria-hidden="true"><path d="M14.5 1 4.967 12 1.5 8.333" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <p class="aff-text-body aff-text-sm">Success message.</p>
</div>

<div class="aff-alert aff-alert-warning" role="alert">
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="5.5" fill="currentColor" r="1"/><path d="M9 8.5v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <p class="aff-text-body aff-text-sm">Warning message.</p>
</div>

<div class="aff-alert aff-alert-error" role="alert">
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="m10.423 5.577-4.846 4.846M5.577 5.577l4.846 4.846M8 15.429A7.429 7.429 0 1 0 8 .57 7.429 7.429 0 0 0 8 15.43Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <p class="aff-text-body aff-text-sm">Error message.</p>
</div>
```


## Callout

Neutral inline note box — for tips, reminders, or non-critical contextual info. Not a status alert.

```html
<div class="aff-callout">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <!-- your icon -->
  </svg>
  <p class="aff-text-body aff-text-sm">Your discount will apply at next shipment.</p>
</div>
```


## Toast

Copy the `initToast` source from [js-utilities.md](js-utilities.md) into the extension and call `initToast(this)` after render.

```html
<!-- Trigger -->
<button class="recharge-button aff-btn aff-btn-secondary" data-toast-show="my-toast">Show toast</button>

<!-- Toast (place outside the main content flow, at the bottom of the extension) -->
<div class="aff-toast-wrapper" id="my-toast" hidden>
  <div class="aff-alert aff-alert-success aff-toast" role="status">
    <svg viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="13" aria-hidden="true"><path d="M14.5 1 4.967 12 1.5 8.333" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <p class="aff-text-body aff-text-sm">Your changes have been saved.</p>
    <button class="aff-toast-close" aria-label="Close" data-toast-close>
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="m10.423 5.577-4.846 4.846M5.577 5.577l4.846 4.846M8 15.429A7.429 7.429 0 1 0 8 .57 7.429 7.429 0 0 0 8 15.43Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </div>
</div>
```


## Modal

Copy the `initModal` source from [js-utilities.md](js-utilities.md) into the extension and call `initModal(this)` after render.

```html
<!-- Trigger -->
<button class="recharge-button aff-btn aff-btn-primary" data-modal-open="my-modal">Open modal</button>

<!-- Modal (place at the bottom of the extension, outside the main content flow) -->
<div class="aff-modal-wrapper" id="my-modal">
  <div class="aff-modal">
    <div class="aff-modal-header">
      <h1 class="aff-h1 aff-text-heading">Modal title</h1>
      <button class="aff-modal-close" data-modal-close aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m1 1 12 12M1 13 13 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <p class="aff-text-body aff-text-base">Modal body text.</p>
    <!-- Group buttons to control spacing between them independently from modal gap -->
    <div class="tw:flex tw:flex-col tw:gap-2">
      <button class="recharge-button aff-btn aff-btn-primary aff-btn-full">Confirm</button>
      <button class="recharge-button aff-btn aff-btn-tertiary aff-btn-full">Cancel</button>
    </div>
  </div>
</div>
```


## Tabs

Copy the `initTabs` source from [js-utilities.md](js-utilities.md) into the extension and call `initTabs(this)` after render.

```html
<div>
  <div class="aff-tabs" role="tablist" aria-label="My tabs">
    <button class="aff-tab" role="tab" aria-selected="true"  aria-controls="panel-1" id="tab-1">Tab one</button>
    <button class="aff-tab" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">Tab two</button>
    <button class="aff-tab" role="tab" aria-selected="false" aria-controls="panel-3" id="tab-3" tabindex="-1">Tab three</button>
  </div>
  <div class="aff-tab-panel is-active" id="panel-1" role="tabpanel" aria-labelledby="tab-1">
    <p class="aff-text-body aff-text-sm">Content for tab one.</p>
  </div>
  <div class="aff-tab-panel" id="panel-2" role="tabpanel" aria-labelledby="tab-2">
    <p class="aff-text-body aff-text-sm">Content for tab two.</p>
  </div>
  <div class="aff-tab-panel" id="panel-3" role="tabpanel" aria-labelledby="tab-3">
    <p class="aff-text-body aff-text-sm">Content for tab three.</p>
  </div>
</div>
```
