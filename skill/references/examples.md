# Layout Recipes

Pick the closest recipe and adapt it. All examples use `aff-*` classes for branding and `tw:` Tailwind utilities for layout.

---

## Cross-sell card

Use when you want to surface a product add-on alongside an existing subscription. 1/3 image, 2/3 content, single CTA.

```html
<div class="tw:grid tw:grid-cols-3 tw:gap-5 tw:items-center">
  <div class="tw:col-span-1">
    <img class="aff-img tw:aspect-square tw:object-cover tw:w-full" src="{{ product.image }}" alt="{{ product.title }}" />
  </div>
  <div class="tw:col-span-2 tw:flex tw:flex-col tw:gap-2">
    <h1 class="aff-h1 aff-text-heading">{{ product.title }}</h1>
    <p class="aff-text-body aff-text-sm">{{ product.description }}</p>
    <p class="aff-text-body aff-text-base">
      <span class="aff-text-muted tw:line-through">{{ product.compare_at_price }}</span>
      &nbsp;{{ product.price }}
    </p>
    <div class="tw:pt-2">
      <button class="recharge-button aff-btn aff-btn-primary">Add to order</button>
    </div>
  </div>
</div>
```

---

## Offer card — 128px image (single, full-width)

Use for a prominent single upgrade offer. Image left, title + price + button stacked in the right column.

```html
<div class="aff-card-offer tw:flex tw:flex-col">
  <h3 class="aff-h3 aff-text-heading">{{ offer.headline }}</h3>
  <div class="tw:flex tw:gap-4 tw:items-center tw:pt-2">
    <img class="aff-img aff-img-md tw:aspect-square tw:object-cover tw:shrink-0" src="{{ product.image }}" alt="{{ product.title }}" />
    <div class="tw:flex tw:flex-col tw:gap-3">
      <div class="tw:flex tw:flex-col tw:gap-2">
        <h3 class="aff-h3 aff-text-heading">{{ product.title }}</h3>
        <p class="aff-text-body aff-text-sm">
          <span class="aff-text-muted tw:line-through">{{ product.compare_at_price }}</span>
          &nbsp;{{ product.price }} per shipment
        </p>
      </div>
      <button class="recharge-button aff-btn aff-btn-primary aff-btn-sm aff-btn-full">{{ offer.cta }}</button>
    </div>
  </div>
</div>
```

---

## Offer card — 96px image, two-up with CTA button

Use when showing two upgrade offers side by side. Image left, content right, button below the card.

```html
<div class="tw:grid tw:grid-cols-2 tw:gap-3">

  <div class="aff-card-offer tw:flex tw:flex-col">
    <h3 class="aff-h3 aff-text-heading">{{ offer.headline }}</h3>
    <div class="tw:flex tw:gap-4 tw:items-center tw:pt-2">
      <img class="aff-img aff-img-sm tw:aspect-square tw:object-cover tw:shrink-0" src="{{ product.image }}" alt="{{ product.title }}" />
      <div class="tw:flex tw:flex-col tw:gap-1">
        <h3 class="aff-h3 aff-text-heading">{{ product.title }}</h3>
        <p class="aff-text-body aff-text-sm">
          <span class="aff-text-muted tw:line-through">{{ product.compare_at_price }}</span>
          &nbsp;{{ product.price }} per shipment
        </p>
      </div>
    </div>
    <button class="recharge-button aff-btn aff-btn-primary aff-btn-full tw:mt-3">{{ offer.cta }}</button>
  </div>

  <!-- repeat for second card -->

</div>
```

---

## Offer card — 96px image, two-up with callout (no button)

Same two-up layout, but the CTA is replaced by an `aff-callout` note when no action is needed — e.g. to confirm a benefit already applied.

```html
<div class="tw:grid tw:grid-cols-2 tw:gap-3">

  <div class="aff-card-offer tw:flex tw:flex-col">
    <h3 class="aff-h3 aff-text-heading">{{ offer.headline }}</h3>
    <div class="tw:flex tw:gap-4 tw:items-center tw:pt-2">
      <img class="aff-img aff-img-sm tw:aspect-square tw:object-cover tw:shrink-0" src="{{ product.image }}" alt="{{ product.title }}" />
      <div class="tw:flex tw:flex-col tw:gap-1">
        <h3 class="aff-h3 aff-text-heading">{{ product.title }}</h3>
        <p class="aff-text-body aff-text-sm">
          <span class="aff-text-muted tw:line-through">{{ product.compare_at_price }}</span>
          &nbsp;{{ product.price }} per shipment
        </p>
      </div>
    </div>
    <div class="aff-callout tw:mt-3">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
      <p class="aff-text-body aff-text-sm">{{ callout.message }}</p>
    </div>
  </div>

  <!-- repeat for second card -->

</div>
```

---

## Cross-sell product carousel — tabbed, scrollable

Use when surfacing multiple add-on products in a horizontally scrollable, tabbed carousel. Tabs and track bleed to the card edge via negative margin; spacers restore the padding inside the scroll area.

```html
<div class="tw:flex tw:flex-col tw:gap-4">

  <div class="tw:flex tw:items-center tw:justify-between tw:gap-2">
    <h2 class="aff-h2 aff-text-heading">Add to your next order</h2>
    <div class="tw:flex tw:gap-2 tw:shrink-0">
      <button class="recharge-button aff-btn aff-btn-secondary aff-btn-icon" id="prev-btn" aria-label="Previous" disabled>
        <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9.726 2.972L0.484 2.972M0.484 2.972L2.972 0.484M0.484 2.972L2.972 5.46" stroke="currentColor" stroke-width="0.968" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="recharge-button aff-btn aff-btn-secondary aff-btn-icon" id="next-btn" aria-label="Next">
        <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0.484 2.972H9.726M7.238 5.46L9.726 2.972L7.238 0.484" stroke="currentColor" stroke-width="0.968" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>

  <div class="tw:-mx-5 tw:lg:-mx-6">
    <div class="aff-tabs tw:px-5 tw:lg:px-6 tw:overflow-x-auto tw:scrollbar-none" role="tablist" aria-label="Product categories">
      <button class="aff-tab" role="tab" aria-selected="true"  data-tab-key="all">All</button>
      <button class="aff-tab" role="tab" aria-selected="false" data-tab-key="food"        tabindex="-1">Food</button>
      <button class="aff-tab" role="tab" aria-selected="false" data-tab-key="hygiene"     tabindex="-1">Hygiene</button>
      <button class="aff-tab" role="tab" aria-selected="false" data-tab-key="accessories" tabindex="-1">Accessories</button>
    </div>
  </div>

  <div class="tw:-mx-5 tw:lg:-mx-6">
    <div
      role="region"
      aria-label="Product carousel"
      class="tw:flex tw:gap-4 tw:overflow-x-auto tw:snap-x tw:snap-mandatory tw:pt-1 tw:pb-1 tw:scrollbar-none"
      style="scroll-padding-left:20px;"
    >
      <div class="tw:shrink-0 tw:w-5 tw:lg:w-6" aria-hidden="true"></div>

      <div class="tw:flex tw:flex-col tw:items-center tw:gap-2 tw:shrink-0 tw:snap-start tw:text-center" style="width:200px;">
        <img class="aff-img aff-img-lg tw:aspect-square tw:object-cover tw:block" src="{{ product.image }}" alt="{{ product.title }}" />
        <div class="tw:flex tw:flex-col tw:w-full tw:gap-1.5">
          <p class="aff-h4 aff-text-heading tw:w-full tw:line-clamp-2">{{ product.title }}</p>
          <p class="aff-text-body aff-text-sm">{{ product.price }}</p>
        </div>
        <button
          class="recharge-button aff-btn aff-btn-primary aff-btn-sm tw:w-full tw:py-1.5 tw:px-2"
          data-variant-id="{{ product.variant_id }}"
        >Add</button>
      </div>

      <!-- repeat for each product -->

      <div class="tw:shrink-0 tw:w-5 tw:lg:w-6" aria-hidden="true"></div>
    </div>
  </div>

</div>
```

---

<!-- Add new recipes below this line -->
