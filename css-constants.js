// Affinity Framework CSS constants
//
// Copy AFF_CSS and TW_CSS into your extension file, then inject them in
// connectedCallback via <style> tags (see skills/affinity-framework/SKILL.md for the exact pattern).
//
// Alternatively, host skills/affinity-framework/assets/aff-framework.css and skills/affinity-framework/assets/tw.css
// on your own CDN and inject them as <link> tags instead.

export const AFF_CSS = `/* =============================================================
   Affinity CSS Framework
   Branding-only classes for Recharge Affinity extensions.
   Layout and spacing are delegated to Tailwind (tw: prefix).
   ============================================================= */


/* ---
   Type scale
--- */

.aff-text-heading {
  font-family: var(--recharge-typography-heading-font-family);
  font-weight: var(--recharge-typography-heading-font-weight);
  margin: 0;
  padding: 0;
}

.aff-display-1 {
  font-size: var(--recharge-typography-size-1);
  line-height: 115%;
}

.aff-display-2 {
  font-size: var(--recharge-typography-size-2);
  line-height: 115%;
}

.aff-h1 {
  font-size: var(--recharge-typography-size-3);
  line-height: 123%;
}

.aff-h2 {
  font-size: var(--recharge-typography-size-4);
  line-height: 140%;
}

.aff-h3 {
  font-size: var(--recharge-typography-size-5);
  line-height: 150%;
}

.aff-h4 {
  font-size: var(--recharge-typography-size-6);
  line-height: 143%;
}


/* ---
   Body text
--- */

.aff-text-body {
  font-family: var(--recharge-typography-body-font-family);
  font-weight: var(--recharge-typography-body-font-weight);
  color: inherit;
}

.aff-text-base {
  font-size: var(--recharge-typography-size-5);
  line-height: 150%;
  margin: 0;
}

.aff-text-sm {
  font-size: var(--recharge-typography-size-6);
  line-height: 143%;
  margin: 0;
}

.aff-text-muted {
  color: var(--recharge-color-neutral-70);
}


/* ---
   Buttons
--- */

.aff-btn {
  font-family: var(--recharge-typography-body-font-family);
  border-radius: var(--recharge-button-border-radius);
  font-size: var(--recharge-typography-size-5);
  line-height: 150%;
  padding: 10px 16px;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  border: 2px solid transparent;
}

.aff-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.aff-btn-sm {
  font-size: var(--recharge-typography-size-6);
}

.aff-btn-full {
  display: block;
  width: 100%;
  padding: 14px 18px;
  line-height: 1;
}

.aff-btn-primary {
  background-color: var(--recharge-button-brand);
  border-color: var(--recharge-button-brand);
  color: var(--recharge-button-color);
  font-weight: 600;
}

.aff-btn-secondary {
  background-color: var(--recharge-color-brand-85);
  border-color: var(--recharge-color-brand-85);
  color: var(--recharge-button-brand);
}

.aff-btn-tertiary {
  background-color: transparent;
  border-color: transparent;
  color: var(--recharge-button-secondary);
}


/* ---
   Link
--- */

.aff-link {
  color: var(--recharge-button-secondary);
  text-decoration: underline;
  cursor: pointer;
  font-size: var(--recharge-typography-size-5);
}


/* ---
   Image
--- */

.aff-img {
  border-radius: calc(var(--recharge-corners-radius) / 2);
  max-width: 100%;
}

.aff-img-sm { width: 96px; }
.aff-img-md { width: 128px; }
.aff-img-lg { width: 200px; }


/* ---
   Radio option
--- */

.aff-radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: calc(var(--recharge-corners-radius) / 2);
  background-color: var(--recharge-color-brand-85);
  color: var(--recharge-typography-primary);
  border: 1px solid transparent;
  cursor: pointer;
}

.aff-radio-option input[type="radio"] {
  accent-color: var(--recharge-button-brand);
}

.aff-radio-option:has(input[type="radio"]:checked) {
  border-color: var(--recharge-button-brand);
}


/* ---
   Input
   Apply aff-input to a wrapper <div>, not the <input> itself —
   this matches how Recharge renders inputs and avoids style conflicts.
--- */

.aff-input {
  display: flex;
  width: 100%;
  border: 1px solid var(--recharge-color-neutral-40);
  border-radius: calc(var(--recharge-corners-radius) / 2);
  padding: 7px 12px;
  min-height: 40px;
  background-color: var(--recharge-cards-background);
  transition-property: background-color, border-color, color;
  transition-timing-function: ease;
  transition-duration: 0.3s;
}

.aff-input:focus-within {
  border-color: var(--recharge-color-brand-120);
}

.aff-input input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--recharge-typography-body-font-family);
  font-size: var(--recharge-typography-size-5);
  color: var(--recharge-color-neutral-80);
  caret-color: var(--recharge-color-brand-120);
}

.aff-input input::placeholder {
  color: var(--recharge-color-neutral-40);
}


/* ---
   Card
--- */

.aff-card {
  background-color: var(--recharge-cards-background);
  border: 1px solid var(--recharge-cards-border-color);
  border-radius: var(--recharge-corners-radius);
  padding: 20px 20px 24px;
}

@media screen and (min-width: 1024px) {
  .aff-card {
    padding: 20px 24px 24px;
  }
}


/* ---
   Offer card
   A secondary card that lives inside a parent card
--- */

.aff-card-offer {
  background-color: var(--recharge-color-neutral-20);
  border: 1px solid var(--recharge-color-neutral-10);
  border-radius: calc(var(--recharge-corners-radius) / 2);
  padding: 12px 16px 16px;
}


/* ---
   Icon button
   Modifier for .aff-btn — makes it square and icon-only.
   Use with .aff-btn-primary / .aff-btn-secondary / .aff-btn-tertiary.
--- */

.aff-btn-icon {
  width: 24px;
  height: 24px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: none;
  border-radius: calc(var(--recharge-corners-radius) / 2);
}

/* ---
   Select
   Apply aff-select to a wrapper <div>, same pattern as aff-input.
   The wrapper uses position: relative for the chevron.
--- */

.aff-select {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--recharge-color-neutral-40);
  border-radius: calc(var(--recharge-corners-radius) / 2);
  padding: 7px 12px;
  min-height: 40px;
  background-color: var(--recharge-cards-background);
  transition-property: background-color, border-color, color;
  transition-timing-function: ease;
  transition-duration: 0.3s;
}

.aff-select:focus-within {
  border-color: var(--recharge-color-brand-120);
}

.aff-select select {
  flex: 1;
  appearance: none;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--recharge-typography-body-font-family);
  font-size: var(--recharge-typography-size-5);
  color: var(--recharge-color-neutral-80);
  cursor: pointer;
}

/* Chevron icon — place a <span class="aff-select-chevron"> inside the wrapper after the <select> */
.aff-select-chevron {
  pointer-events: none;
  display: flex;
  align-items: center;
  color: var(--recharge-color-neutral-70);
  flex-shrink: 0;
}


/* ---
   Quantity stepper
   Apply aff-stepper to a wrapper <div>.
   Inner structure: <button> − | <input type="number"> | <button> +
--- */

.aff-stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--recharge-color-neutral-40);
  border-radius: var(--recharge-corners-radius);
  padding: 7px 8px;
  min-height: 40px;
  background-color: var(--recharge-cards-background);
}

.aff-stepper button {
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  flex-shrink: 0;
  padding: 0;
}

.aff-stepper button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.aff-stepper input[type="number"] {
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
  width: 40px;
  font-family: var(--recharge-typography-body-font-family);
  font-size: var(--recharge-typography-size-5);
  color: var(--recharge-color-neutral-80);
  -moz-appearance: textfield;
}

.aff-stepper input[type="number"]::-webkit-inner-spin-button,
.aff-stepper input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}


/* ---
   Badge
--- */

.aff-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 18px;
  font-size: var(--recharge-typography-size-7);
  line-height: 133%;
  font-family: var(--recharge-typography-body-font-family);
  font-weight: var(--recharge-typography-body-font-weight);
  background-color: #ebeaea;
  color: var(--recharge-typography-primary, #3c352d);
}

.aff-badge-warning {
  background-color: var(--recharge-color-caution, #f5a623);
  color: var(--recharge-color-neutral, #0b1317);
}


/* ---
   Alert
   Usage: <div class="aff-alert aff-alert-info" role="alert">
            <svg>...</svg>
            <p class="aff-text-body aff-text-sm">Message</p>
          </div>
   Variants: aff-alert-info · aff-alert-success · aff-alert-warning · aff-alert-error
--- */

.aff-alert {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: var(--recharge-corners-radius, 8px);
  color: var(--recharge-typography-primary, #3c352d);
}

.aff-alert svg {
  flex-shrink: 0;
  margin-top: 1px;
}

.aff-alert-info {
  background-color: var(--recharge-color-neutral-20, #f7f7f7);
  border-color: #ebeaea;
}

.aff-alert-success {
  background-color: var(--recharge-color-positive10, #cdeedd);
  border-color: var(--recharge-color-positive, #00853e);
  color: var(--recharge-color-neutral, #0b1317);
}

.aff-alert-warning {
  background-color: var(--recharge-color-caution10, #fef6e4);
  border-color: var(--recharge-color-caution120, #c97a00);
  color: var(--recharge-color-neutral, #0b1317);
}

.aff-alert-error {
  background-color: var(--recharge-color-critical10, #fde8e8);
  border-color: var(--recharge-color-critical, #cc2929);
  color: var(--recharge-color-neutral, #0b1317);
}


/* ---
   Toast
--- */

.aff-toast-wrapper {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 556px;
  z-index: 9999;
  pointer-events: none;
}

.aff-toast {
  pointer-events: all;
  border-radius: calc(var(--recharge-corners-radius, 8px) / 2);
  box-shadow: rgba(25, 29, 72, 0.15) 0px 1px 4px 0px, rgba(25, 29, 72, 0.2) 0px 2px 12px 0px;
}

.aff-toast-close {
  margin-left: auto;
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  color: inherit;
  opacity: 0.6;
  font-size: 18px;
}

.aff-toast-close:hover {
  opacity: 1;
}


/* ---
   Toggle
--- */

.aff-toggle {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.aff-toggle input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.aff-toggle-track {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  width: 48px;
  height: 26px;
  border-radius: 34px;
  background-color: var(--recharge-color-neutral-40);
  transition: background-color 0.3s;
}

.aff-toggle-track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
}

.aff-toggle input[type="checkbox"]:checked + .aff-toggle-track {
  background-color: var(--recharge-color-brand);
}

.aff-toggle input[type="checkbox"]:checked + .aff-toggle-track::after {
  transform: translateX(22px);
}

.aff-toggle input[type="checkbox"]:focus-visible + .aff-toggle-track {
  outline: 2px solid var(--recharge-color-brand);
  outline-offset: 2px;
}


/* ---
   Callout
--- */

.aff-callout {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--recharge-cards-background);
  border: 1px solid var(--recharge-color-neutral-30, #e8e4e0);
  border-radius: calc(var(--recharge-corners-radius, 8px) / 2);
  padding: 8px 12px;
}

.aff-callout svg {
  flex-shrink: 0;
  color: var(--recharge-color-brand);
}


/* ---
   Modal
--- */

.aff-modal-wrapper {
  position: fixed;
  inset: 0;
  z-index: var(--recharge-app-modal-zIndex);
  background: rgba(11, 19, 23, 0.25);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  isolation: isolate;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  will-change: opacity;
}

.aff-modal-wrapper.is-open {
  opacity: 1;
  pointer-events: all;
}

.aff-modal {
  position: relative;
  width: 600px;
  max-width: 100vw;
  max-height: 640px;
  overflow: auto;
  background-color: var(--recharge-cards-background);
  padding: 24px;
  border-radius: var(--recharge-corners-radius, 8px) var(--recharge-corners-radius, 8px) 0 0;
  cursor: default;
  display: flex;
  flex-direction: column;
  gap: 16px !important;
  transform: translateY(20px);
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  will-change: opacity, transform;
}

.aff-modal-wrapper.is-open .aff-modal {
  opacity: 1;
  transform: translateY(0);
}

.aff-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.aff-modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--recharge-typography-primary);
  line-height: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media screen and (min-width: 1024px) {
  .aff-modal-wrapper {
    align-items: center;
  }
  .aff-modal {
    border-radius: var(--recharge-corners-radius, 8px);
  }
}

/* ─── Tabs ─────────────────────────────────────────────────────────────── */

.aff-tabs {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}

.aff-tab {
  padding: 0 8px 12px;
  font-size: var(--recharge-typography-size-5, 1rem);
  font-family: var(--recharge-typography-body-font-family, inherit);
  font-weight: var(--recharge-typography-body-font-weight, 400);
  color: #b1aeab;
  border: none;
  border-bottom: 2px solid #b1aeab;
  background: transparent;
  cursor: pointer;
  text-decoration: none;
  line-height: 1.4;
  white-space: nowrap;
}

.aff-tab[aria-selected="true"],
.aff-tab.is-active {
  font-weight: var(--recharge-typography-heading-font-weight, 600);
  color: var(--recharge-typography-primary, #3c352d);
  border-bottom-color: var(--recharge-button-brand, #1773b0);
}

.aff-tab:hover:not([aria-selected="true"]):not(.is-active) {
  color: var(--recharge-typography-secondary, #545a5d);
}

.aff-tab-panel {
  display: none;
}

.aff-tab-panel.is-active {
  display: block;
  padding-top: 20px;
}`;

export const TW_CSS = `/*! tailwindcss v4.2.2 | MIT License | https://tailwindcss.com */
@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-scroll-snap-strictness:proximity;--tw-space-y-reverse:0;--tw-space-x-reverse:0}}}@layer theme{:root,:host{--tw-spacing:.25rem;--tw-container-xs:20rem;--tw-container-sm:24rem;--tw-container-md:28rem;--tw-container-lg:32rem;--tw-container-xl:36rem;--tw-container-2xl:42rem;--tw-container-3xl:48rem;--tw-container-4xl:56rem;--tw-container-5xl:64rem;--tw-container-6xl:72rem;--tw-container-7xl:80rem;--tw-aspect-video:16 / 9}}@layer components;@layer utilities{.tw\:pointer-events-auto{pointer-events:auto}.tw\:pointer-events-none{pointer-events:none}.tw\:invisible{visibility:hidden}.tw\:visible{visibility:visible}.tw\:absolute{position:absolute}.tw\:fixed{position:fixed}.tw\:relative{position:relative}.tw\:static{position:static}.tw\:sticky{position:sticky}.tw\:inset-0{inset:calc(var(--tw-spacing) * 0)}.tw\:inset-auto{inset:auto}.tw\:inset-full{inset:100%}.tw\:inset-x-0{inset-inline:calc(var(--tw-spacing) * 0)}.tw\:inset-x-auto{inset-inline:auto}.tw\:inset-x-full{inset-inline:100%}.tw\:inset-y-0{inset-block:calc(var(--tw-spacing) * 0)}.tw\:inset-y-auto{inset-block:auto}.tw\:inset-y-full{inset-block:100%}.tw\:top-0{top:calc(var(--tw-spacing) * 0)}.tw\:top-auto{top:auto}.tw\:top-full{top:100%}.tw\:right-0{right:calc(var(--tw-spacing) * 0)}.tw\:right-auto{right:auto}.tw\:right-full{right:100%}.tw\:bottom-0{bottom:calc(var(--tw-spacing) * 0)}.tw\:bottom-auto{bottom:auto}.tw\:bottom-full{bottom:100%}.tw\:left-0{left:calc(var(--tw-spacing) * 0)}.tw\:left-auto{left:auto}.tw\:left-full{left:100%}.tw\:z-0{z-index:0}.tw\:z-10{z-index:10}.tw\:z-20{z-index:20}.tw\:z-30{z-index:30}.tw\:z-40{z-index:40}.tw\:z-50{z-index:50}.tw\:z-auto{z-index:auto}.tw\:order-1{order:1}.tw\:order-2{order:2}.tw\:order-3{order:3}.tw\:order-4{order:4}.tw\:order-5{order:5}.tw\:order-6{order:6}.tw\:order-first{order:-9999}.tw\:order-last{order:9999}.tw\:order-none{order:0}.tw\:col-span-1{grid-column:span 1/span 1}.tw\:col-span-2{grid-column:span 2/span 2}.tw\:col-span-3{grid-column:span 3/span 3}.tw\:col-span-4{grid-column:span 4/span 4}.tw\:col-span-5{grid-column:span 5/span 5}.tw\:col-span-6{grid-column:span 6/span 6}.tw\:col-span-full{grid-column:1/-1}.tw\:row-span-1{grid-row:span 1/span 1}.tw\:row-span-2{grid-row:span 2/span 2}.tw\:row-span-3{grid-row:span 3/span 3}.tw\:row-span-full{grid-row:1/-1}.tw\:-m-0\.5{margin:calc(var(--tw-spacing) * -.5)}.tw\:-m-1{margin:calc(var(--tw-spacing) * -1)}.tw\:-m-1\.5{margin:calc(var(--tw-spacing) * -1.5)}.tw\:-m-2{margin:calc(var(--tw-spacing) * -2)}.tw\:-m-3{margin:calc(var(--tw-spacing) * -3)}.tw\:-m-4{margin:calc(var(--tw-spacing) * -4)}.tw\:-m-5{margin:calc(var(--tw-spacing) * -5)}.tw\:-m-6{margin:calc(var(--tw-spacing) * -6)}.tw\:-m-8{margin:calc(var(--tw-spacing) * -8)}.tw\:m-0{margin:calc(var(--tw-spacing) * 0)}.tw\:m-0\.5{margin:calc(var(--tw-spacing) * .5)}.tw\:m-1{margin:calc(var(--tw-spacing) * 1)}.tw\:m-1\.5{margin:calc(var(--tw-spacing) * 1.5)}.tw\:m-2{margin:calc(var(--tw-spacing) * 2)}.tw\:m-3{margin:calc(var(--tw-spacing) * 3)}.tw\:m-4{margin:calc(var(--tw-spacing) * 4)}.tw\:m-5{margin:calc(var(--tw-spacing) * 5)}.tw\:m-6{margin:calc(var(--tw-spacing) * 6)}.tw\:m-8{margin:calc(var(--tw-spacing) * 8)}.tw\:m-auto{margin:auto}.tw\:-mx-0\.5{margin-inline:calc(var(--tw-spacing) * -.5)}.tw\:-mx-1{margin-inline:calc(var(--tw-spacing) * -1)}.tw\:-mx-1\.5{margin-inline:calc(var(--tw-spacing) * -1.5)}.tw\:-mx-2{margin-inline:calc(var(--tw-spacing) * -2)}.tw\:-mx-3{margin-inline:calc(var(--tw-spacing) * -3)}.tw\:-mx-4{margin-inline:calc(var(--tw-spacing) * -4)}.tw\:-mx-5{margin-inline:calc(var(--tw-spacing) * -5)}.tw\:-mx-6{margin-inline:calc(var(--tw-spacing) * -6)}.tw\:-mx-8{margin-inline:calc(var(--tw-spacing) * -8)}.tw\:mx-0{margin-inline:calc(var(--tw-spacing) * 0)}.tw\:mx-0\.5{margin-inline:calc(var(--tw-spacing) * .5)}.tw\:mx-1{margin-inline:calc(var(--tw-spacing) * 1)}.tw\:mx-1\.5{margin-inline:calc(var(--tw-spacing) * 1.5)}.tw\:mx-2{margin-inline:calc(var(--tw-spacing) * 2)}.tw\:mx-3{margin-inline:calc(var(--tw-spacing) * 3)}.tw\:mx-4{margin-inline:calc(var(--tw-spacing) * 4)}.tw\:mx-5{margin-inline:calc(var(--tw-spacing) * 5)}.tw\:mx-6{margin-inline:calc(var(--tw-spacing) * 6)}.tw\:mx-8{margin-inline:calc(var(--tw-spacing) * 8)}.tw\:mx-auto{margin-inline:auto}.tw\:-my-0\.5{margin-block:calc(var(--tw-spacing) * -.5)}.tw\:-my-1{margin-block:calc(var(--tw-spacing) * -1)}.tw\:-my-1\.5{margin-block:calc(var(--tw-spacing) * -1.5)}.tw\:-my-2{margin-block:calc(var(--tw-spacing) * -2)}.tw\:-my-3{margin-block:calc(var(--tw-spacing) * -3)}.tw\:-my-4{margin-block:calc(var(--tw-spacing) * -4)}.tw\:-my-5{margin-block:calc(var(--tw-spacing) * -5)}.tw\:-my-6{margin-block:calc(var(--tw-spacing) * -6)}.tw\:-my-8{margin-block:calc(var(--tw-spacing) * -8)}.tw\:my-0{margin-block:calc(var(--tw-spacing) * 0)}.tw\:my-0\.5{margin-block:calc(var(--tw-spacing) * .5)}.tw\:my-1{margin-block:calc(var(--tw-spacing) * 1)}.tw\:my-1\.5{margin-block:calc(var(--tw-spacing) * 1.5)}.tw\:my-2{margin-block:calc(var(--tw-spacing) * 2)}.tw\:my-3{margin-block:calc(var(--tw-spacing) * 3)}.tw\:my-4{margin-block:calc(var(--tw-spacing) * 4)}.tw\:my-5{margin-block:calc(var(--tw-spacing) * 5)}.tw\:my-6{margin-block:calc(var(--tw-spacing) * 6)}.tw\:my-8{margin-block:calc(var(--tw-spacing) * 8)}.tw\:my-auto{margin-block:auto}.tw\:-mt-0\.5{margin-top:calc(var(--tw-spacing) * -.5)}.tw\:-mt-1{margin-top:calc(var(--tw-spacing) * -1)}.tw\:-mt-1\.5{margin-top:calc(var(--tw-spacing) * -1.5)}.tw\:-mt-2{margin-top:calc(var(--tw-spacing) * -2)}.tw\:-mt-3{margin-top:calc(var(--tw-spacing) * -3)}.tw\:-mt-4{margin-top:calc(var(--tw-spacing) * -4)}.tw\:-mt-5{margin-top:calc(var(--tw-spacing) * -5)}.tw\:-mt-6{margin-top:calc(var(--tw-spacing) * -6)}.tw\:-mt-8{margin-top:calc(var(--tw-spacing) * -8)}.tw\:mt-0{margin-top:calc(var(--tw-spacing) * 0)}.tw\:mt-0\.5{margin-top:calc(var(--tw-spacing) * .5)}.tw\:mt-1{margin-top:calc(var(--tw-spacing) * 1)}.tw\:mt-1\.5{margin-top:calc(var(--tw-spacing) * 1.5)}.tw\:mt-2{margin-top:calc(var(--tw-spacing) * 2)}.tw\:mt-3{margin-top:calc(var(--tw-spacing) * 3)}.tw\:mt-4{margin-top:calc(var(--tw-spacing) * 4)}.tw\:mt-5{margin-top:calc(var(--tw-spacing) * 5)}.tw\:mt-6{margin-top:calc(var(--tw-spacing) * 6)}.tw\:mt-8{margin-top:calc(var(--tw-spacing) * 8)}.tw\:mt-auto{margin-top:auto}.tw\:-mr-0\.5{margin-right:calc(var(--tw-spacing) * -.5)}.tw\:-mr-1{margin-right:calc(var(--tw-spacing) * -1)}.tw\:-mr-1\.5{margin-right:calc(var(--tw-spacing) * -1.5)}.tw\:-mr-2{margin-right:calc(var(--tw-spacing) * -2)}.tw\:-mr-3{margin-right:calc(var(--tw-spacing) * -3)}.tw\:-mr-4{margin-right:calc(var(--tw-spacing) * -4)}.tw\:-mr-5{margin-right:calc(var(--tw-spacing) * -5)}.tw\:-mr-6{margin-right:calc(var(--tw-spacing) * -6)}.tw\:-mr-8{margin-right:calc(var(--tw-spacing) * -8)}.tw\:mr-0{margin-right:calc(var(--tw-spacing) * 0)}.tw\:mr-0\.5{margin-right:calc(var(--tw-spacing) * .5)}.tw\:mr-1{margin-right:calc(var(--tw-spacing) * 1)}.tw\:mr-1\.5{margin-right:calc(var(--tw-spacing) * 1.5)}.tw\:mr-2{margin-right:calc(var(--tw-spacing) * 2)}.tw\:mr-3{margin-right:calc(var(--tw-spacing) * 3)}.tw\:mr-4{margin-right:calc(var(--tw-spacing) * 4)}.tw\:mr-5{margin-right:calc(var(--tw-spacing) * 5)}.tw\:mr-6{margin-right:calc(var(--tw-spacing) * 6)}.tw\:mr-8{margin-right:calc(var(--tw-spacing) * 8)}.tw\:mr-auto{margin-right:auto}.tw\:-mb-0\.5{margin-bottom:calc(var(--tw-spacing) * -.5)}.tw\:-mb-1{margin-bottom:calc(var(--tw-spacing) * -1)}.tw\:-mb-1\.5{margin-bottom:calc(var(--tw-spacing) * -1.5)}.tw\:-mb-2{margin-bottom:calc(var(--tw-spacing) * -2)}.tw\:-mb-3{margin-bottom:calc(var(--tw-spacing) * -3)}.tw\:-mb-4{margin-bottom:calc(var(--tw-spacing) * -4)}.tw\:-mb-5{margin-bottom:calc(var(--tw-spacing) * -5)}.tw\:-mb-6{margin-bottom:calc(var(--tw-spacing) * -6)}.tw\:-mb-8{margin-bottom:calc(var(--tw-spacing) * -8)}.tw\:mb-0{margin-bottom:calc(var(--tw-spacing) * 0)}.tw\:mb-0\.5{margin-bottom:calc(var(--tw-spacing) * .5)}.tw\:mb-1{margin-bottom:calc(var(--tw-spacing) * 1)}.tw\:mb-1\.5{margin-bottom:calc(var(--tw-spacing) * 1.5)}.tw\:mb-2{margin-bottom:calc(var(--tw-spacing) * 2)}.tw\:mb-3{margin-bottom:calc(var(--tw-spacing) * 3)}.tw\:mb-4{margin-bottom:calc(var(--tw-spacing) * 4)}.tw\:mb-5{margin-bottom:calc(var(--tw-spacing) * 5)}.tw\:mb-6{margin-bottom:calc(var(--tw-spacing) * 6)}.tw\:mb-8{margin-bottom:calc(var(--tw-spacing) * 8)}.tw\:mb-auto{margin-bottom:auto}.tw\:-ml-0\.5{margin-left:calc(var(--tw-spacing) * -.5)}.tw\:-ml-1{margin-left:calc(var(--tw-spacing) * -1)}.tw\:-ml-1\.5{margin-left:calc(var(--tw-spacing) * -1.5)}.tw\:-ml-2{margin-left:calc(var(--tw-spacing) * -2)}.tw\:-ml-3{margin-left:calc(var(--tw-spacing) * -3)}.tw\:-ml-4{margin-left:calc(var(--tw-spacing) * -4)}.tw\:-ml-5{margin-left:calc(var(--tw-spacing) * -5)}.tw\:-ml-6{margin-left:calc(var(--tw-spacing) * -6)}.tw\:-ml-8{margin-left:calc(var(--tw-spacing) * -8)}.tw\:ml-0{margin-left:calc(var(--tw-spacing) * 0)}.tw\:ml-0\.5{margin-left:calc(var(--tw-spacing) * .5)}.tw\:ml-1{margin-left:calc(var(--tw-spacing) * 1)}.tw\:ml-1\.5{margin-left:calc(var(--tw-spacing) * 1.5)}.tw\:ml-2{margin-left:calc(var(--tw-spacing) * 2)}.tw\:ml-3{margin-left:calc(var(--tw-spacing) * 3)}.tw\:ml-4{margin-left:calc(var(--tw-spacing) * 4)}.tw\:ml-5{margin-left:calc(var(--tw-spacing) * 5)}.tw\:ml-6{margin-left:calc(var(--tw-spacing) * 6)}.tw\:ml-8{margin-left:calc(var(--tw-spacing) * 8)}.tw\:ml-auto{margin-left:auto}.tw\:box-border{box-sizing:border-box}.tw\:box-content{box-sizing:content-box}.tw\:block{display:block}.tw\:flex{display:flex}.tw\:grid{display:grid}.tw\:hidden{display:none}.tw\:inline{display:inline}.tw\:inline-block{display:inline-block}.tw\:inline-flex{display:inline-flex}.tw\:inline-grid{display:inline-grid}.tw\:aspect-square{aspect-ratio:1}.tw\:aspect-video{aspect-ratio:var(--tw-aspect-video)}.tw\:h-0{height:calc(var(--tw-spacing) * 0)}.tw\:h-0\.5{height:calc(var(--tw-spacing) * .5)}.tw\:h-1{height:calc(var(--tw-spacing) * 1)}.tw\:h-1\.5{height:calc(var(--tw-spacing) * 1.5)}.tw\:h-2{height:calc(var(--tw-spacing) * 2)}.tw\:h-3{height:calc(var(--tw-spacing) * 3)}.tw\:h-4{height:calc(var(--tw-spacing) * 4)}.tw\:h-5{height:calc(var(--tw-spacing) * 5)}.tw\:h-6{height:calc(var(--tw-spacing) * 6)}.tw\:h-8{height:calc(var(--tw-spacing) * 8)}.tw\:h-auto{height:auto}.tw\:h-fit{height:fit-content}.tw\:h-full{height:100%}.tw\:h-screen{height:100vh}.tw\:max-h-0{max-height:calc(var(--tw-spacing) * 0)}.tw\:max-h-fit{max-height:fit-content}.tw\:max-h-full{max-height:100%}.tw\:max-h-none{max-height:none}.tw\:max-h-screen{max-height:100vh}.tw\:min-h-0{min-height:calc(var(--tw-spacing) * 0)}.tw\:min-h-fit{min-height:fit-content}.tw\:min-h-full{min-height:100%}.tw\:min-h-screen{min-height:100vh}.tw\:w-0{width:calc(var(--tw-spacing) * 0)}.tw\:w-0\.5{width:calc(var(--tw-spacing) * .5)}.tw\:w-1{width:calc(var(--tw-spacing) * 1)}.tw\:w-1\.5{width:calc(var(--tw-spacing) * 1.5)}.tw\:w-1\/2{width:50%}.tw\:w-1\/3{width:33.3333%}.tw\:w-1\/4{width:25%}.tw\:w-2{width:calc(var(--tw-spacing) * 2)}.tw\:w-2\/3{width:66.6667%}.tw\:w-3{width:calc(var(--tw-spacing) * 3)}.tw\:w-3\/4{width:75%}.tw\:w-4{width:calc(var(--tw-spacing) * 4)}.tw\:w-5{width:calc(var(--tw-spacing) * 5)}.tw\:w-6{width:calc(var(--tw-spacing) * 6)}.tw\:w-8{width:calc(var(--tw-spacing) * 8)}.tw\:w-auto{width:auto}.tw\:w-fit{width:fit-content}.tw\:w-full{width:100%}.tw\:w-px{width:1px}.tw\:w-screen{width:100vw}.tw\:max-w-fit{max-width:fit-content}.tw\:max-w-full{max-width:100%}.tw\:max-w-none{max-width:none}.tw\:min-w-0{min-width:calc(var(--tw-spacing) * 0)}.tw\:min-w-full{min-width:100%}.tw\:flex-1{flex:1}.tw\:flex-auto{flex:auto}.tw\:flex-initial{flex:0 auto}.tw\:flex-none{flex:none}.tw\:shrink{flex-shrink:1}.tw\:shrink-0{flex-shrink:0}.tw\:grow{flex-grow:1}.tw\:grow-0{flex-grow:0}.tw\:cursor-auto{cursor:auto}.tw\:cursor-default{cursor:default}.tw\:cursor-grab{cursor:grab}.tw\:cursor-grabbing{cursor:grabbing}.tw\:cursor-not-allowed{cursor:not-allowed}.tw\:cursor-pointer{cursor:pointer}.tw\:touch-manipulation{touch-action:manipulation}.tw\:touch-none{touch-action:none}.tw\:snap-both{scroll-snap-type:both var(--tw-scroll-snap-strictness)}.tw\:snap-none{scroll-snap-type:none}.tw\:snap-x{scroll-snap-type:x var(--tw-scroll-snap-strictness)}.tw\:snap-y{scroll-snap-type:y var(--tw-scroll-snap-strictness)}.tw\:snap-mandatory{--tw-scroll-snap-strictness:mandatory}.tw\:snap-proximity{--tw-scroll-snap-strictness:proximity}.tw\:snap-center{scroll-snap-align:center}.tw\:snap-end{scroll-snap-align:end}.tw\:snap-start{scroll-snap-align:start}.tw\:auto-cols-auto{grid-auto-columns:auto}.tw\:auto-cols-fr{grid-auto-columns:minmax(0,1fr)}.tw\:grid-flow-col{grid-auto-flow:column}.tw\:grid-flow-row{grid-auto-flow:row}.tw\:auto-rows-auto{grid-auto-rows:auto}.tw\:auto-rows-fr{grid-auto-rows:minmax(0,1fr)}.tw\:grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.tw\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.tw\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.tw\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.tw\:grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.tw\:grid-cols-6{grid-template-columns:repeat(6,minmax(0,1fr))}.tw\:grid-cols-none{grid-template-columns:none}.tw\:grid-rows-1{grid-template-rows:repeat(1,minmax(0,1fr))}.tw\:grid-rows-2{grid-template-rows:repeat(2,minmax(0,1fr))}.tw\:grid-rows-3{grid-template-rows:repeat(3,minmax(0,1fr))}.tw\:grid-rows-4{grid-template-rows:repeat(4,minmax(0,1fr))}.tw\:grid-rows-5{grid-template-rows:repeat(5,minmax(0,1fr))}.tw\:grid-rows-6{grid-template-rows:repeat(6,minmax(0,1fr))}.tw\:grid-rows-none{grid-template-rows:none}.tw\:flex-col{flex-direction:column}.tw\:flex-row{flex-direction:row}.tw\:flex-nowrap{flex-wrap:nowrap}.tw\:flex-wrap{flex-wrap:wrap}.tw\:flex-wrap-reverse{flex-wrap:wrap-reverse}.tw\:content-around{align-content:space-around}.tw\:content-baseline{align-content:baseline}.tw\:content-between{align-content:space-between}.tw\:content-center{align-content:center}.tw\:content-end{align-content:flex-end}.tw\:content-evenly{align-content:space-evenly}.tw\:content-normal{align-content:normal}.tw\:content-start{align-content:flex-start}.tw\:content-stretch{align-content:stretch}.tw\:items-baseline{align-items:baseline}.tw\:items-center{align-items:center}.tw\:items-end{align-items:flex-end}.tw\:items-start{align-items:flex-start}.tw\:items-stretch{align-items:stretch}.tw\:justify-around{justify-content:space-around}.tw\:justify-between{justify-content:space-between}.tw\:justify-center{justify-content:center}.tw\:justify-end{justify-content:flex-end}.tw\:justify-evenly{justify-content:space-evenly}.tw\:justify-normal{justify-content:normal}.tw\:justify-start{justify-content:flex-start}.tw\:justify-stretch{justify-content:stretch}.tw\:justify-items-center{justify-items:center}.tw\:justify-items-end{justify-items:end}.tw\:justify-items-normal{justify-items:normal}.tw\:justify-items-start{justify-items:start}.tw\:justify-items-stretch{justify-items:stretch}.tw\:gap-0{gap:calc(var(--tw-spacing) * 0)}.tw\:gap-0\.5{gap:calc(var(--tw-spacing) * .5)}.tw\:gap-1{gap:calc(var(--tw-spacing) * 1)}.tw\:gap-1\.5{gap:calc(var(--tw-spacing) * 1.5)}.tw\:gap-2{gap:calc(var(--tw-spacing) * 2)}.tw\:gap-3{gap:calc(var(--tw-spacing) * 3)}.tw\:gap-4{gap:calc(var(--tw-spacing) * 4)}.tw\:gap-5{gap:calc(var(--tw-spacing) * 5)}.tw\:gap-6{gap:calc(var(--tw-spacing) * 6)}.tw\:gap-8{gap:calc(var(--tw-spacing) * 8)}:where(.tw\:space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 0) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 0) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:space-y-0\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * .5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * .5) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:space-y-1>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 1) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 1) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:space-y-1\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 1.5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 1.5) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 2) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 2) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:space-y-3>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 3) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 3) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 4) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 4) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:space-y-5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 5) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:space-y-6>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 6) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 6) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:space-y-8>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 8) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 8) * calc(1 - var(--tw-space-y-reverse)))}.tw\:gap-x-0{column-gap:calc(var(--tw-spacing) * 0)}.tw\:gap-x-0\.5{column-gap:calc(var(--tw-spacing) * .5)}.tw\:gap-x-1{column-gap:calc(var(--tw-spacing) * 1)}.tw\:gap-x-1\.5{column-gap:calc(var(--tw-spacing) * 1.5)}.tw\:gap-x-2{column-gap:calc(var(--tw-spacing) * 2)}.tw\:gap-x-3{column-gap:calc(var(--tw-spacing) * 3)}.tw\:gap-x-4{column-gap:calc(var(--tw-spacing) * 4)}.tw\:gap-x-5{column-gap:calc(var(--tw-spacing) * 5)}.tw\:gap-x-6{column-gap:calc(var(--tw-spacing) * 6)}.tw\:gap-x-8{column-gap:calc(var(--tw-spacing) * 8)}:where(.tw\:space-x-0>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 0) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 0) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:space-x-0\.5>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * .5) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * .5) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:space-x-1>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 1) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 1) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:space-x-1\.5>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 1.5) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 1.5) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:space-x-2>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 2) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 2) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:space-x-3>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 3) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 3) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:space-x-4>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 4) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 4) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:space-x-5>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 5) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 5) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:space-x-6>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 6) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 6) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:space-x-8>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 8) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 8) * calc(1 - var(--tw-space-x-reverse)))}.tw\:gap-y-0{row-gap:calc(var(--tw-spacing) * 0)}.tw\:gap-y-0\.5{row-gap:calc(var(--tw-spacing) * .5)}.tw\:gap-y-1{row-gap:calc(var(--tw-spacing) * 1)}.tw\:gap-y-1\.5{row-gap:calc(var(--tw-spacing) * 1.5)}.tw\:gap-y-2{row-gap:calc(var(--tw-spacing) * 2)}.tw\:gap-y-3{row-gap:calc(var(--tw-spacing) * 3)}.tw\:gap-y-4{row-gap:calc(var(--tw-spacing) * 4)}.tw\:gap-y-5{row-gap:calc(var(--tw-spacing) * 5)}.tw\:gap-y-6{row-gap:calc(var(--tw-spacing) * 6)}.tw\:gap-y-8{row-gap:calc(var(--tw-spacing) * 8)}.tw\:self-auto{align-self:auto}.tw\:self-baseline{align-self:baseline}.tw\:self-center{align-self:center}.tw\:self-end{align-self:flex-end}.tw\:self-start{align-self:flex-start}.tw\:self-stretch{align-self:stretch}.tw\:justify-self-auto{justify-self:auto}.tw\:justify-self-center{justify-self:center}.tw\:justify-self-end{justify-self:flex-end}.tw\:justify-self-start{justify-self:flex-start}.tw\:justify-self-stretch{justify-self:stretch}.tw\:overflow-auto{overflow:auto}.tw\:overflow-hidden{overflow:hidden}.tw\:overflow-scroll{overflow:scroll}.tw\:overflow-visible{overflow:visible}.tw\:overflow-x-auto{overflow-x:auto}.tw\:overflow-x-hidden{overflow-x:hidden}.tw\:overflow-x-scroll{overflow-x:scroll}.tw\:overflow-x-visible{overflow-x:visible}.tw\:overflow-y-auto{overflow-y:auto}.tw\:overflow-y-hidden{overflow-y:hidden}.tw\:overflow-y-scroll{overflow-y:scroll}.tw\:overflow-y-visible{overflow-y:visible}.tw\:object-contain{object-fit:contain}.tw\:object-cover{object-fit:cover}.tw\:object-center{object-position:center}.tw\:p-0{padding:calc(var(--tw-spacing) * 0)}.tw\:p-0\.5{padding:calc(var(--tw-spacing) * .5)}.tw\:p-1{padding:calc(var(--tw-spacing) * 1)}.tw\:p-1\.5{padding:calc(var(--tw-spacing) * 1.5)}.tw\:p-2{padding:calc(var(--tw-spacing) * 2)}.tw\:p-3{padding:calc(var(--tw-spacing) * 3)}.tw\:p-4{padding:calc(var(--tw-spacing) * 4)}.tw\:p-5{padding:calc(var(--tw-spacing) * 5)}.tw\:p-6{padding:calc(var(--tw-spacing) * 6)}.tw\:p-8{padding:calc(var(--tw-spacing) * 8)}.tw\:px-0{padding-inline:calc(var(--tw-spacing) * 0)}.tw\:px-0\.5{padding-inline:calc(var(--tw-spacing) * .5)}.tw\:px-1{padding-inline:calc(var(--tw-spacing) * 1)}.tw\:px-1\.5{padding-inline:calc(var(--tw-spacing) * 1.5)}.tw\:px-2{padding-inline:calc(var(--tw-spacing) * 2)}.tw\:px-3{padding-inline:calc(var(--tw-spacing) * 3)}.tw\:px-4{padding-inline:calc(var(--tw-spacing) * 4)}.tw\:px-5{padding-inline:calc(var(--tw-spacing) * 5)}.tw\:px-6{padding-inline:calc(var(--tw-spacing) * 6)}.tw\:px-8{padding-inline:calc(var(--tw-spacing) * 8)}.tw\:py-0{padding-block:calc(var(--tw-spacing) * 0)}.tw\:py-0\.5{padding-block:calc(var(--tw-spacing) * .5)}.tw\:py-1{padding-block:calc(var(--tw-spacing) * 1)}.tw\:py-1\.5{padding-block:calc(var(--tw-spacing) * 1.5)}.tw\:py-2{padding-block:calc(var(--tw-spacing) * 2)}.tw\:py-3{padding-block:calc(var(--tw-spacing) * 3)}.tw\:py-4{padding-block:calc(var(--tw-spacing) * 4)}.tw\:py-5{padding-block:calc(var(--tw-spacing) * 5)}.tw\:py-6{padding-block:calc(var(--tw-spacing) * 6)}.tw\:py-8{padding-block:calc(var(--tw-spacing) * 8)}.tw\:pt-0{padding-top:calc(var(--tw-spacing) * 0)}.tw\:pt-0\.5{padding-top:calc(var(--tw-spacing) * .5)}.tw\:pt-1{padding-top:calc(var(--tw-spacing) * 1)}.tw\:pt-1\.5{padding-top:calc(var(--tw-spacing) * 1.5)}.tw\:pt-2{padding-top:calc(var(--tw-spacing) * 2)}.tw\:pt-3{padding-top:calc(var(--tw-spacing) * 3)}.tw\:pt-4{padding-top:calc(var(--tw-spacing) * 4)}.tw\:pt-5{padding-top:calc(var(--tw-spacing) * 5)}.tw\:pt-6{padding-top:calc(var(--tw-spacing) * 6)}.tw\:pt-8{padding-top:calc(var(--tw-spacing) * 8)}.tw\:pr-0{padding-right:calc(var(--tw-spacing) * 0)}.tw\:pr-0\.5{padding-right:calc(var(--tw-spacing) * .5)}.tw\:pr-1{padding-right:calc(var(--tw-spacing) * 1)}.tw\:pr-1\.5{padding-right:calc(var(--tw-spacing) * 1.5)}.tw\:pr-2{padding-right:calc(var(--tw-spacing) * 2)}.tw\:pr-3{padding-right:calc(var(--tw-spacing) * 3)}.tw\:pr-4{padding-right:calc(var(--tw-spacing) * 4)}.tw\:pr-5{padding-right:calc(var(--tw-spacing) * 5)}.tw\:pr-6{padding-right:calc(var(--tw-spacing) * 6)}.tw\:pr-8{padding-right:calc(var(--tw-spacing) * 8)}.tw\:pb-0{padding-bottom:calc(var(--tw-spacing) * 0)}.tw\:pb-0\.5{padding-bottom:calc(var(--tw-spacing) * .5)}.tw\:pb-1{padding-bottom:calc(var(--tw-spacing) * 1)}.tw\:pb-1\.5{padding-bottom:calc(var(--tw-spacing) * 1.5)}.tw\:pb-2{padding-bottom:calc(var(--tw-spacing) * 2)}.tw\:pb-3{padding-bottom:calc(var(--tw-spacing) * 3)}.tw\:pb-4{padding-bottom:calc(var(--tw-spacing) * 4)}.tw\:pb-5{padding-bottom:calc(var(--tw-spacing) * 5)}.tw\:pb-6{padding-bottom:calc(var(--tw-spacing) * 6)}.tw\:pb-8{padding-bottom:calc(var(--tw-spacing) * 8)}.tw\:pl-0{padding-left:calc(var(--tw-spacing) * 0)}.tw\:pl-0\.5{padding-left:calc(var(--tw-spacing) * .5)}.tw\:pl-1{padding-left:calc(var(--tw-spacing) * 1)}.tw\:pl-1\.5{padding-left:calc(var(--tw-spacing) * 1.5)}.tw\:pl-2{padding-left:calc(var(--tw-spacing) * 2)}.tw\:pl-3{padding-left:calc(var(--tw-spacing) * 3)}.tw\:pl-4{padding-left:calc(var(--tw-spacing) * 4)}.tw\:pl-5{padding-left:calc(var(--tw-spacing) * 5)}.tw\:pl-6{padding-left:calc(var(--tw-spacing) * 6)}.tw\:pl-8{padding-left:calc(var(--tw-spacing) * 8)}.tw\:text-left{text-align:left}.tw\:text-center{text-align:center}.tw\:text-right{text-align:right}.tw\:line-clamp-1{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1}.tw\:line-clamp-2{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}.tw\:line-clamp-3{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}.tw\:scrollbar-none{scrollbar-width:none}.tw\:scrollbar-none::-webkit-scrollbar{display:none}}@property --tw-scroll-snap-strictness{syntax:"*";inherits:false;initial-value:proximity}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-space-x-reverse{syntax:"*";inherits:false;initial-value:0}
@media (min-width:1024px){.tw\:lg\:pointer-events-auto{pointer-events:auto}.tw\:lg\:pointer-events-none{pointer-events:none}.tw\:lg\:invisible{visibility:hidden}.tw\:lg\:visible{visibility:visible}.tw\:lg\:absolute{position:absolute}.tw\:lg\:fixed{position:fixed}.tw\:lg\:relative{position:relative}.tw\:lg\:static{position:static}.tw\:lg\:sticky{position:sticky}.tw\:lg\:inset-0{inset:calc(var(--tw-spacing) * 0)}.tw\:lg\:inset-auto{inset:auto}.tw\:lg\:inset-full{inset:100%}.tw\:lg\:inset-x-0{inset-inline:calc(var(--tw-spacing) * 0)}.tw\:lg\:inset-x-auto{inset-inline:auto}.tw\:lg\:inset-x-full{inset-inline:100%}.tw\:lg\:inset-y-0{inset-block:calc(var(--tw-spacing) * 0)}.tw\:lg\:inset-y-auto{inset-block:auto}.tw\:lg\:inset-y-full{inset-block:100%}.tw\:lg\:top-0{top:calc(var(--tw-spacing) * 0)}.tw\:lg\:top-auto{top:auto}.tw\:lg\:top-full{top:100%}.tw\:lg\:right-0{right:calc(var(--tw-spacing) * 0)}.tw\:lg\:right-auto{right:auto}.tw\:lg\:right-full{right:100%}.tw\:lg\:bottom-0{bottom:calc(var(--tw-spacing) * 0)}.tw\:lg\:bottom-auto{bottom:auto}.tw\:lg\:bottom-full{bottom:100%}.tw\:lg\:left-0{left:calc(var(--tw-spacing) * 0)}.tw\:lg\:left-auto{left:auto}.tw\:lg\:left-full{left:100%}.tw\:lg\:z-0{z-index:0}.tw\:lg\:z-10{z-index:10}.tw\:lg\:z-20{z-index:20}.tw\:lg\:z-30{z-index:30}.tw\:lg\:z-40{z-index:40}.tw\:lg\:z-50{z-index:50}.tw\:lg\:z-auto{z-index:auto}.tw\:lg\:order-1{order:1}.tw\:lg\:order-2{order:2}.tw\:lg\:order-3{order:3}.tw\:lg\:order-4{order:4}.tw\:lg\:order-5{order:5}.tw\:lg\:order-6{order:6}.tw\:lg\:order-first{order:-9999}.tw\:lg\:order-last{order:9999}.tw\:lg\:order-none{order:0}.tw\:lg\:col-span-1{grid-column:span 1/span 1}.tw\:lg\:col-span-2{grid-column:span 2/span 2}.tw\:lg\:col-span-3{grid-column:span 3/span 3}.tw\:lg\:col-span-4{grid-column:span 4/span 4}.tw\:lg\:col-span-5{grid-column:span 5/span 5}.tw\:lg\:col-span-6{grid-column:span 6/span 6}.tw\:lg\:col-span-full{grid-column:1/-1}.tw\:lg\:row-span-1{grid-row:span 1/span 1}.tw\:lg\:row-span-2{grid-row:span 2/span 2}.tw\:lg\:row-span-3{grid-row:span 3/span 3}.tw\:lg\:row-span-full{grid-row:1/-1}.tw\:lg\:-m-0\.5{margin:calc(var(--tw-spacing) * -.5)}.tw\:lg\:-m-1{margin:calc(var(--tw-spacing) * -1)}.tw\:lg\:-m-1\.5{margin:calc(var(--tw-spacing) * -1.5)}.tw\:lg\:-m-2{margin:calc(var(--tw-spacing) * -2)}.tw\:lg\:-m-3{margin:calc(var(--tw-spacing) * -3)}.tw\:lg\:-m-4{margin:calc(var(--tw-spacing) * -4)}.tw\:lg\:-m-5{margin:calc(var(--tw-spacing) * -5)}.tw\:lg\:-m-6{margin:calc(var(--tw-spacing) * -6)}.tw\:lg\:-m-8{margin:calc(var(--tw-spacing) * -8)}.tw\:lg\:m-0{margin:calc(var(--tw-spacing) * 0)}.tw\:lg\:m-0\.5{margin:calc(var(--tw-spacing) * .5)}.tw\:lg\:m-1{margin:calc(var(--tw-spacing) * 1)}.tw\:lg\:m-1\.5{margin:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:m-2{margin:calc(var(--tw-spacing) * 2)}.tw\:lg\:m-3{margin:calc(var(--tw-spacing) * 3)}.tw\:lg\:m-4{margin:calc(var(--tw-spacing) * 4)}.tw\:lg\:m-5{margin:calc(var(--tw-spacing) * 5)}.tw\:lg\:m-6{margin:calc(var(--tw-spacing) * 6)}.tw\:lg\:m-8{margin:calc(var(--tw-spacing) * 8)}.tw\:lg\:m-auto{margin:auto}.tw\:lg\:-mx-0\.5{margin-inline:calc(var(--tw-spacing) * -.5)}.tw\:lg\:-mx-1{margin-inline:calc(var(--tw-spacing) * -1)}.tw\:lg\:-mx-1\.5{margin-inline:calc(var(--tw-spacing) * -1.5)}.tw\:lg\:-mx-2{margin-inline:calc(var(--tw-spacing) * -2)}.tw\:lg\:-mx-3{margin-inline:calc(var(--tw-spacing) * -3)}.tw\:lg\:-mx-4{margin-inline:calc(var(--tw-spacing) * -4)}.tw\:lg\:-mx-5{margin-inline:calc(var(--tw-spacing) * -5)}.tw\:lg\:-mx-6{margin-inline:calc(var(--tw-spacing) * -6)}.tw\:lg\:-mx-8{margin-inline:calc(var(--tw-spacing) * -8)}.tw\:lg\:mx-0{margin-inline:calc(var(--tw-spacing) * 0)}.tw\:lg\:mx-0\.5{margin-inline:calc(var(--tw-spacing) * .5)}.tw\:lg\:mx-1{margin-inline:calc(var(--tw-spacing) * 1)}.tw\:lg\:mx-1\.5{margin-inline:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:mx-2{margin-inline:calc(var(--tw-spacing) * 2)}.tw\:lg\:mx-3{margin-inline:calc(var(--tw-spacing) * 3)}.tw\:lg\:mx-4{margin-inline:calc(var(--tw-spacing) * 4)}.tw\:lg\:mx-5{margin-inline:calc(var(--tw-spacing) * 5)}.tw\:lg\:mx-6{margin-inline:calc(var(--tw-spacing) * 6)}.tw\:lg\:mx-8{margin-inline:calc(var(--tw-spacing) * 8)}.tw\:lg\:mx-auto{margin-inline:auto}.tw\:lg\:-my-0\.5{margin-block:calc(var(--tw-spacing) * -.5)}.tw\:lg\:-my-1{margin-block:calc(var(--tw-spacing) * -1)}.tw\:lg\:-my-1\.5{margin-block:calc(var(--tw-spacing) * -1.5)}.tw\:lg\:-my-2{margin-block:calc(var(--tw-spacing) * -2)}.tw\:lg\:-my-3{margin-block:calc(var(--tw-spacing) * -3)}.tw\:lg\:-my-4{margin-block:calc(var(--tw-spacing) * -4)}.tw\:lg\:-my-5{margin-block:calc(var(--tw-spacing) * -5)}.tw\:lg\:-my-6{margin-block:calc(var(--tw-spacing) * -6)}.tw\:lg\:-my-8{margin-block:calc(var(--tw-spacing) * -8)}.tw\:lg\:my-0{margin-block:calc(var(--tw-spacing) * 0)}.tw\:lg\:my-0\.5{margin-block:calc(var(--tw-spacing) * .5)}.tw\:lg\:my-1{margin-block:calc(var(--tw-spacing) * 1)}.tw\:lg\:my-1\.5{margin-block:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:my-2{margin-block:calc(var(--tw-spacing) * 2)}.tw\:lg\:my-3{margin-block:calc(var(--tw-spacing) * 3)}.tw\:lg\:my-4{margin-block:calc(var(--tw-spacing) * 4)}.tw\:lg\:my-5{margin-block:calc(var(--tw-spacing) * 5)}.tw\:lg\:my-6{margin-block:calc(var(--tw-spacing) * 6)}.tw\:lg\:my-8{margin-block:calc(var(--tw-spacing) * 8)}.tw\:lg\:my-auto{margin-block:auto}.tw\:lg\:-mt-0\.5{margin-top:calc(var(--tw-spacing) * -.5)}.tw\:lg\:-mt-1{margin-top:calc(var(--tw-spacing) * -1)}.tw\:lg\:-mt-1\.5{margin-top:calc(var(--tw-spacing) * -1.5)}.tw\:lg\:-mt-2{margin-top:calc(var(--tw-spacing) * -2)}.tw\:lg\:-mt-3{margin-top:calc(var(--tw-spacing) * -3)}.tw\:lg\:-mt-4{margin-top:calc(var(--tw-spacing) * -4)}.tw\:lg\:-mt-5{margin-top:calc(var(--tw-spacing) * -5)}.tw\:lg\:-mt-6{margin-top:calc(var(--tw-spacing) * -6)}.tw\:lg\:-mt-8{margin-top:calc(var(--tw-spacing) * -8)}.tw\:lg\:mt-0{margin-top:calc(var(--tw-spacing) * 0)}.tw\:lg\:mt-0\.5{margin-top:calc(var(--tw-spacing) * .5)}.tw\:lg\:mt-1{margin-top:calc(var(--tw-spacing) * 1)}.tw\:lg\:mt-1\.5{margin-top:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:mt-2{margin-top:calc(var(--tw-spacing) * 2)}.tw\:lg\:mt-3{margin-top:calc(var(--tw-spacing) * 3)}.tw\:lg\:mt-4{margin-top:calc(var(--tw-spacing) * 4)}.tw\:lg\:mt-5{margin-top:calc(var(--tw-spacing) * 5)}.tw\:lg\:mt-6{margin-top:calc(var(--tw-spacing) * 6)}.tw\:lg\:mt-8{margin-top:calc(var(--tw-spacing) * 8)}.tw\:lg\:mt-auto{margin-top:auto}.tw\:lg\:-mr-0\.5{margin-right:calc(var(--tw-spacing) * -.5)}.tw\:lg\:-mr-1{margin-right:calc(var(--tw-spacing) * -1)}.tw\:lg\:-mr-1\.5{margin-right:calc(var(--tw-spacing) * -1.5)}.tw\:lg\:-mr-2{margin-right:calc(var(--tw-spacing) * -2)}.tw\:lg\:-mr-3{margin-right:calc(var(--tw-spacing) * -3)}.tw\:lg\:-mr-4{margin-right:calc(var(--tw-spacing) * -4)}.tw\:lg\:-mr-5{margin-right:calc(var(--tw-spacing) * -5)}.tw\:lg\:-mr-6{margin-right:calc(var(--tw-spacing) * -6)}.tw\:lg\:-mr-8{margin-right:calc(var(--tw-spacing) * -8)}.tw\:lg\:mr-0{margin-right:calc(var(--tw-spacing) * 0)}.tw\:lg\:mr-0\.5{margin-right:calc(var(--tw-spacing) * .5)}.tw\:lg\:mr-1{margin-right:calc(var(--tw-spacing) * 1)}.tw\:lg\:mr-1\.5{margin-right:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:mr-2{margin-right:calc(var(--tw-spacing) * 2)}.tw\:lg\:mr-3{margin-right:calc(var(--tw-spacing) * 3)}.tw\:lg\:mr-4{margin-right:calc(var(--tw-spacing) * 4)}.tw\:lg\:mr-5{margin-right:calc(var(--tw-spacing) * 5)}.tw\:lg\:mr-6{margin-right:calc(var(--tw-spacing) * 6)}.tw\:lg\:mr-8{margin-right:calc(var(--tw-spacing) * 8)}.tw\:lg\:mr-auto{margin-right:auto}.tw\:lg\:-mb-0\.5{margin-bottom:calc(var(--tw-spacing) * -.5)}.tw\:lg\:-mb-1{margin-bottom:calc(var(--tw-spacing) * -1)}.tw\:lg\:-mb-1\.5{margin-bottom:calc(var(--tw-spacing) * -1.5)}.tw\:lg\:-mb-2{margin-bottom:calc(var(--tw-spacing) * -2)}.tw\:lg\:-mb-3{margin-bottom:calc(var(--tw-spacing) * -3)}.tw\:lg\:-mb-4{margin-bottom:calc(var(--tw-spacing) * -4)}.tw\:lg\:-mb-5{margin-bottom:calc(var(--tw-spacing) * -5)}.tw\:lg\:-mb-6{margin-bottom:calc(var(--tw-spacing) * -6)}.tw\:lg\:-mb-8{margin-bottom:calc(var(--tw-spacing) * -8)}.tw\:lg\:mb-0{margin-bottom:calc(var(--tw-spacing) * 0)}.tw\:lg\:mb-0\.5{margin-bottom:calc(var(--tw-spacing) * .5)}.tw\:lg\:mb-1{margin-bottom:calc(var(--tw-spacing) * 1)}.tw\:lg\:mb-1\.5{margin-bottom:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:mb-2{margin-bottom:calc(var(--tw-spacing) * 2)}.tw\:lg\:mb-3{margin-bottom:calc(var(--tw-spacing) * 3)}.tw\:lg\:mb-4{margin-bottom:calc(var(--tw-spacing) * 4)}.tw\:lg\:mb-5{margin-bottom:calc(var(--tw-spacing) * 5)}.tw\:lg\:mb-6{margin-bottom:calc(var(--tw-spacing) * 6)}.tw\:lg\:mb-8{margin-bottom:calc(var(--tw-spacing) * 8)}.tw\:lg\:mb-auto{margin-bottom:auto}.tw\:lg\:-ml-0\.5{margin-left:calc(var(--tw-spacing) * -.5)}.tw\:lg\:-ml-1{margin-left:calc(var(--tw-spacing) * -1)}.tw\:lg\:-ml-1\.5{margin-left:calc(var(--tw-spacing) * -1.5)}.tw\:lg\:-ml-2{margin-left:calc(var(--tw-spacing) * -2)}.tw\:lg\:-ml-3{margin-left:calc(var(--tw-spacing) * -3)}.tw\:lg\:-ml-4{margin-left:calc(var(--tw-spacing) * -4)}.tw\:lg\:-ml-5{margin-left:calc(var(--tw-spacing) * -5)}.tw\:lg\:-ml-6{margin-left:calc(var(--tw-spacing) * -6)}.tw\:lg\:-ml-8{margin-left:calc(var(--tw-spacing) * -8)}.tw\:lg\:ml-0{margin-left:calc(var(--tw-spacing) * 0)}.tw\:lg\:ml-0\.5{margin-left:calc(var(--tw-spacing) * .5)}.tw\:lg\:ml-1{margin-left:calc(var(--tw-spacing) * 1)}.tw\:lg\:ml-1\.5{margin-left:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:ml-2{margin-left:calc(var(--tw-spacing) * 2)}.tw\:lg\:ml-3{margin-left:calc(var(--tw-spacing) * 3)}.tw\:lg\:ml-4{margin-left:calc(var(--tw-spacing) * 4)}.tw\:lg\:ml-5{margin-left:calc(var(--tw-spacing) * 5)}.tw\:lg\:ml-6{margin-left:calc(var(--tw-spacing) * 6)}.tw\:lg\:ml-8{margin-left:calc(var(--tw-spacing) * 8)}.tw\:lg\:ml-auto{margin-left:auto}.tw\:lg\:box-border{box-sizing:border-box}.tw\:lg\:box-content{box-sizing:content-box}.tw\:lg\:block{display:block}.tw\:lg\:flex{display:flex}.tw\:lg\:grid{display:grid}.tw\:lg\:hidden{display:none}.tw\:lg\:inline{display:inline}.tw\:lg\:inline-block{display:inline-block}.tw\:lg\:inline-flex{display:inline-flex}.tw\:lg\:inline-grid{display:inline-grid}.tw\:lg\:aspect-square{aspect-ratio:1}.tw\:lg\:aspect-video{aspect-ratio:var(--tw-aspect-video)}.tw\:lg\:h-0{height:calc(var(--tw-spacing) * 0)}.tw\:lg\:h-0\.5{height:calc(var(--tw-spacing) * .5)}.tw\:lg\:h-1{height:calc(var(--tw-spacing) * 1)}.tw\:lg\:h-1\.5{height:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:h-2{height:calc(var(--tw-spacing) * 2)}.tw\:lg\:h-3{height:calc(var(--tw-spacing) * 3)}.tw\:lg\:h-4{height:calc(var(--tw-spacing) * 4)}.tw\:lg\:h-5{height:calc(var(--tw-spacing) * 5)}.tw\:lg\:h-6{height:calc(var(--tw-spacing) * 6)}.tw\:lg\:h-8{height:calc(var(--tw-spacing) * 8)}.tw\:lg\:h-auto{height:auto}.tw\:lg\:h-fit{height:fit-content}.tw\:lg\:h-full{height:100%}.tw\:lg\:h-screen{height:100vh}.tw\:lg\:max-h-0{max-height:calc(var(--tw-spacing) * 0)}.tw\:lg\:max-h-fit{max-height:fit-content}.tw\:lg\:max-h-full{max-height:100%}.tw\:lg\:max-h-none{max-height:none}.tw\:lg\:max-h-screen{max-height:100vh}.tw\:lg\:min-h-0{min-height:calc(var(--tw-spacing) * 0)}.tw\:lg\:min-h-fit{min-height:fit-content}.tw\:lg\:min-h-full{min-height:100%}.tw\:lg\:min-h-screen{min-height:100vh}.tw\:lg\:w-0{width:calc(var(--tw-spacing) * 0)}.tw\:lg\:w-0\.5{width:calc(var(--tw-spacing) * .5)}.tw\:lg\:w-1{width:calc(var(--tw-spacing) * 1)}.tw\:lg\:w-1\.5{width:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:w-1\/2{width:50%}.tw\:lg\:w-1\/3{width:33.3333%}.tw\:lg\:w-1\/4{width:25%}.tw\:lg\:w-2{width:calc(var(--tw-spacing) * 2)}.tw\:lg\:w-2\/3{width:66.6667%}.tw\:lg\:w-3{width:calc(var(--tw-spacing) * 3)}.tw\:lg\:w-3\/4{width:75%}.tw\:lg\:w-4{width:calc(var(--tw-spacing) * 4)}.tw\:lg\:w-5{width:calc(var(--tw-spacing) * 5)}.tw\:lg\:w-6{width:calc(var(--tw-spacing) * 6)}.tw\:lg\:w-8{width:calc(var(--tw-spacing) * 8)}.tw\:lg\:w-auto{width:auto}.tw\:lg\:w-fit{width:fit-content}.tw\:lg\:w-full{width:100%}.tw\:lg\:w-px{width:1px}.tw\:lg\:w-screen{width:100vw}.tw\:lg\:max-w-fit{max-width:fit-content}.tw\:lg\:max-w-full{max-width:100%}.tw\:lg\:max-w-none{max-width:none}.tw\:lg\:min-w-0{min-width:calc(var(--tw-spacing) * 0)}.tw\:lg\:min-w-full{min-width:100%}.tw\:lg\:flex-1{flex:1}.tw\:lg\:flex-auto{flex:auto}.tw\:lg\:flex-initial{flex:0 auto}.tw\:lg\:flex-none{flex:none}.tw\:lg\:shrink{flex-shrink:1}.tw\:lg\:shrink-0{flex-shrink:0}.tw\:lg\:grow{flex-grow:1}.tw\:lg\:grow-0{flex-grow:0}.tw\:lg\:cursor-auto{cursor:auto}.tw\:lg\:cursor-default{cursor:default}.tw\:lg\:cursor-grab{cursor:grab}.tw\:lg\:cursor-grabbing{cursor:grabbing}.tw\:lg\:cursor-not-allowed{cursor:not-allowed}.tw\:lg\:cursor-pointer{cursor:pointer}.tw\:lg\:touch-manipulation{touch-action:manipulation}.tw\:lg\:touch-none{touch-action:none}.tw\:lg\:snap-both{scroll-snap-type:both var(--tw-scroll-snap-strictness)}.tw\:lg\:snap-none{scroll-snap-type:none}.tw\:lg\:snap-x{scroll-snap-type:x var(--tw-scroll-snap-strictness)}.tw\:lg\:snap-y{scroll-snap-type:y var(--tw-scroll-snap-strictness)}.tw\:lg\:snap-mandatory{--tw-scroll-snap-strictness:mandatory}.tw\:lg\:snap-proximity{--tw-scroll-snap-strictness:proximity}.tw\:lg\:snap-center{scroll-snap-align:center}.tw\:lg\:snap-end{scroll-snap-align:end}.tw\:lg\:snap-start{scroll-snap-align:start}.tw\:lg\:auto-cols-auto{grid-auto-columns:auto}.tw\:lg\:auto-cols-fr{grid-auto-columns:minmax(0,1fr)}.tw\:lg\:grid-flow-col{grid-auto-flow:column}.tw\:lg\:grid-flow-row{grid-auto-flow:row}.tw\:lg\:auto-rows-auto{grid-auto-rows:auto}.tw\:lg\:auto-rows-fr{grid-auto-rows:minmax(0,1fr)}.tw\:lg\:grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.tw\:lg\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.tw\:lg\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.tw\:lg\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.tw\:lg\:grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.tw\:lg\:grid-cols-6{grid-template-columns:repeat(6,minmax(0,1fr))}.tw\:lg\:grid-cols-none{grid-template-columns:none}.tw\:lg\:grid-rows-1{grid-template-rows:repeat(1,minmax(0,1fr))}.tw\:lg\:grid-rows-2{grid-template-rows:repeat(2,minmax(0,1fr))}.tw\:lg\:grid-rows-3{grid-template-rows:repeat(3,minmax(0,1fr))}.tw\:lg\:grid-rows-4{grid-template-rows:repeat(4,minmax(0,1fr))}.tw\:lg\:grid-rows-5{grid-template-rows:repeat(5,minmax(0,1fr))}.tw\:lg\:grid-rows-6{grid-template-rows:repeat(6,minmax(0,1fr))}.tw\:lg\:grid-rows-none{grid-template-rows:none}.tw\:lg\:flex-col{flex-direction:column}.tw\:lg\:flex-row{flex-direction:row}.tw\:lg\:flex-nowrap{flex-wrap:nowrap}.tw\:lg\:flex-wrap{flex-wrap:wrap}.tw\:lg\:flex-wrap-reverse{flex-wrap:wrap-reverse}.tw\:lg\:content-around{align-content:space-around}.tw\:lg\:content-baseline{align-content:baseline}.tw\:lg\:content-between{align-content:space-between}.tw\:lg\:content-center{align-content:center}.tw\:lg\:content-end{align-content:flex-end}.tw\:lg\:content-evenly{align-content:space-evenly}.tw\:lg\:content-normal{align-content:normal}.tw\:lg\:content-start{align-content:flex-start}.tw\:lg\:content-stretch{align-content:stretch}.tw\:lg\:items-baseline{align-items:baseline}.tw\:lg\:items-center{align-items:center}.tw\:lg\:items-end{align-items:flex-end}.tw\:lg\:items-start{align-items:flex-start}.tw\:lg\:items-stretch{align-items:stretch}.tw\:lg\:justify-around{justify-content:space-around}.tw\:lg\:justify-between{justify-content:space-between}.tw\:lg\:justify-center{justify-content:center}.tw\:lg\:justify-end{justify-content:flex-end}.tw\:lg\:justify-evenly{justify-content:space-evenly}.tw\:lg\:justify-normal{justify-content:normal}.tw\:lg\:justify-start{justify-content:flex-start}.tw\:lg\:justify-stretch{justify-content:stretch}.tw\:lg\:justify-items-center{justify-items:center}.tw\:lg\:justify-items-end{justify-items:end}.tw\:lg\:justify-items-normal{justify-items:normal}.tw\:lg\:justify-items-start{justify-items:start}.tw\:lg\:justify-items-stretch{justify-items:stretch}.tw\:lg\:gap-0{gap:calc(var(--tw-spacing) * 0)}.tw\:lg\:gap-0\.5{gap:calc(var(--tw-spacing) * .5)}.tw\:lg\:gap-1{gap:calc(var(--tw-spacing) * 1)}.tw\:lg\:gap-1\.5{gap:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:gap-2{gap:calc(var(--tw-spacing) * 2)}.tw\:lg\:gap-3{gap:calc(var(--tw-spacing) * 3)}.tw\:lg\:gap-4{gap:calc(var(--tw-spacing) * 4)}.tw\:lg\:gap-5{gap:calc(var(--tw-spacing) * 5)}.tw\:lg\:gap-6{gap:calc(var(--tw-spacing) * 6)}.tw\:lg\:gap-8{gap:calc(var(--tw-spacing) * 8)}:where(.tw\:lg\:space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 0) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 0) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:lg\:space-y-0\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * .5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * .5) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:lg\:space-y-1>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 1) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 1) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:lg\:space-y-1\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 1.5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 1.5) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:lg\:space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 2) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 2) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:lg\:space-y-3>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 3) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 3) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:lg\:space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 4) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 4) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:lg\:space-y-5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 5) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:lg\:space-y-6>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 6) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 6) * calc(1 - var(--tw-space-y-reverse)))}:where(.tw\:lg\:space-y-8>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--tw-spacing) * 8) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--tw-spacing) * 8) * calc(1 - var(--tw-space-y-reverse)))}.tw\:lg\:gap-x-0{column-gap:calc(var(--tw-spacing) * 0)}.tw\:lg\:gap-x-0\.5{column-gap:calc(var(--tw-spacing) * .5)}.tw\:lg\:gap-x-1{column-gap:calc(var(--tw-spacing) * 1)}.tw\:lg\:gap-x-1\.5{column-gap:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:gap-x-2{column-gap:calc(var(--tw-spacing) * 2)}.tw\:lg\:gap-x-3{column-gap:calc(var(--tw-spacing) * 3)}.tw\:lg\:gap-x-4{column-gap:calc(var(--tw-spacing) * 4)}.tw\:lg\:gap-x-5{column-gap:calc(var(--tw-spacing) * 5)}.tw\:lg\:gap-x-6{column-gap:calc(var(--tw-spacing) * 6)}.tw\:lg\:gap-x-8{column-gap:calc(var(--tw-spacing) * 8)}:where(.tw\:lg\:space-x-0>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 0) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 0) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:lg\:space-x-0\.5>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * .5) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * .5) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:lg\:space-x-1>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 1) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 1) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:lg\:space-x-1\.5>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 1.5) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 1.5) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:lg\:space-x-2>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 2) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 2) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:lg\:space-x-3>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 3) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 3) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:lg\:space-x-4>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 4) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 4) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:lg\:space-x-5>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 5) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 5) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:lg\:space-x-6>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 6) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 6) * calc(1 - var(--tw-space-x-reverse)))}:where(.tw\:lg\:space-x-8>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--tw-spacing) * 8) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--tw-spacing) * 8) * calc(1 - var(--tw-space-x-reverse)))}.tw\:lg\:gap-y-0{row-gap:calc(var(--tw-spacing) * 0)}.tw\:lg\:gap-y-0\.5{row-gap:calc(var(--tw-spacing) * .5)}.tw\:lg\:gap-y-1{row-gap:calc(var(--tw-spacing) * 1)}.tw\:lg\:gap-y-1\.5{row-gap:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:gap-y-2{row-gap:calc(var(--tw-spacing) * 2)}.tw\:lg\:gap-y-3{row-gap:calc(var(--tw-spacing) * 3)}.tw\:lg\:gap-y-4{row-gap:calc(var(--tw-spacing) * 4)}.tw\:lg\:gap-y-5{row-gap:calc(var(--tw-spacing) * 5)}.tw\:lg\:gap-y-6{row-gap:calc(var(--tw-spacing) * 6)}.tw\:lg\:gap-y-8{row-gap:calc(var(--tw-spacing) * 8)}.tw\:lg\:self-auto{align-self:auto}.tw\:lg\:self-baseline{align-self:baseline}.tw\:lg\:self-center{align-self:center}.tw\:lg\:self-end{align-self:flex-end}.tw\:lg\:self-start{align-self:flex-start}.tw\:lg\:self-stretch{align-self:stretch}.tw\:lg\:justify-self-auto{justify-self:auto}.tw\:lg\:justify-self-center{justify-self:center}.tw\:lg\:justify-self-end{justify-self:flex-end}.tw\:lg\:justify-self-start{justify-self:flex-start}.tw\:lg\:justify-self-stretch{justify-self:stretch}.tw\:lg\:overflow-auto{overflow:auto}.tw\:lg\:overflow-hidden{overflow:hidden}.tw\:lg\:overflow-scroll{overflow:scroll}.tw\:lg\:overflow-visible{overflow:visible}.tw\:lg\:overflow-x-auto{overflow-x:auto}.tw\:lg\:overflow-x-hidden{overflow-x:hidden}.tw\:lg\:overflow-x-scroll{overflow-x:scroll}.tw\:lg\:overflow-x-visible{overflow-x:visible}.tw\:lg\:overflow-y-auto{overflow-y:auto}.tw\:lg\:overflow-y-hidden{overflow-y:hidden}.tw\:lg\:overflow-y-scroll{overflow-y:scroll}.tw\:lg\:overflow-y-visible{overflow-y:visible}.tw\:lg\:object-contain{object-fit:contain}.tw\:lg\:object-cover{object-fit:cover}.tw\:lg\:object-center{object-position:center}.tw\:lg\:p-0{padding:calc(var(--tw-spacing) * 0)}.tw\:lg\:p-0\.5{padding:calc(var(--tw-spacing) * .5)}.tw\:lg\:p-1{padding:calc(var(--tw-spacing) * 1)}.tw\:lg\:p-1\.5{padding:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:p-2{padding:calc(var(--tw-spacing) * 2)}.tw\:lg\:p-3{padding:calc(var(--tw-spacing) * 3)}.tw\:lg\:p-4{padding:calc(var(--tw-spacing) * 4)}.tw\:lg\:p-5{padding:calc(var(--tw-spacing) * 5)}.tw\:lg\:p-6{padding:calc(var(--tw-spacing) * 6)}.tw\:lg\:p-8{padding:calc(var(--tw-spacing) * 8)}.tw\:lg\:px-0{padding-inline:calc(var(--tw-spacing) * 0)}.tw\:lg\:px-0\.5{padding-inline:calc(var(--tw-spacing) * .5)}.tw\:lg\:px-1{padding-inline:calc(var(--tw-spacing) * 1)}.tw\:lg\:px-1\.5{padding-inline:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:px-2{padding-inline:calc(var(--tw-spacing) * 2)}.tw\:lg\:px-3{padding-inline:calc(var(--tw-spacing) * 3)}.tw\:lg\:px-4{padding-inline:calc(var(--tw-spacing) * 4)}.tw\:lg\:px-5{padding-inline:calc(var(--tw-spacing) * 5)}.tw\:lg\:px-6{padding-inline:calc(var(--tw-spacing) * 6)}.tw\:lg\:px-8{padding-inline:calc(var(--tw-spacing) * 8)}.tw\:lg\:py-0{padding-block:calc(var(--tw-spacing) * 0)}.tw\:lg\:py-0\.5{padding-block:calc(var(--tw-spacing) * .5)}.tw\:lg\:py-1{padding-block:calc(var(--tw-spacing) * 1)}.tw\:lg\:py-1\.5{padding-block:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:py-2{padding-block:calc(var(--tw-spacing) * 2)}.tw\:lg\:py-3{padding-block:calc(var(--tw-spacing) * 3)}.tw\:lg\:py-4{padding-block:calc(var(--tw-spacing) * 4)}.tw\:lg\:py-5{padding-block:calc(var(--tw-spacing) * 5)}.tw\:lg\:py-6{padding-block:calc(var(--tw-spacing) * 6)}.tw\:lg\:py-8{padding-block:calc(var(--tw-spacing) * 8)}.tw\:lg\:pt-0{padding-top:calc(var(--tw-spacing) * 0)}.tw\:lg\:pt-0\.5{padding-top:calc(var(--tw-spacing) * .5)}.tw\:lg\:pt-1{padding-top:calc(var(--tw-spacing) * 1)}.tw\:lg\:pt-1\.5{padding-top:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:pt-2{padding-top:calc(var(--tw-spacing) * 2)}.tw\:lg\:pt-3{padding-top:calc(var(--tw-spacing) * 3)}.tw\:lg\:pt-4{padding-top:calc(var(--tw-spacing) * 4)}.tw\:lg\:pt-5{padding-top:calc(var(--tw-spacing) * 5)}.tw\:lg\:pt-6{padding-top:calc(var(--tw-spacing) * 6)}.tw\:lg\:pt-8{padding-top:calc(var(--tw-spacing) * 8)}.tw\:lg\:pr-0{padding-right:calc(var(--tw-spacing) * 0)}.tw\:lg\:pr-0\.5{padding-right:calc(var(--tw-spacing) * .5)}.tw\:lg\:pr-1{padding-right:calc(var(--tw-spacing) * 1)}.tw\:lg\:pr-1\.5{padding-right:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:pr-2{padding-right:calc(var(--tw-spacing) * 2)}.tw\:lg\:pr-3{padding-right:calc(var(--tw-spacing) * 3)}.tw\:lg\:pr-4{padding-right:calc(var(--tw-spacing) * 4)}.tw\:lg\:pr-5{padding-right:calc(var(--tw-spacing) * 5)}.tw\:lg\:pr-6{padding-right:calc(var(--tw-spacing) * 6)}.tw\:lg\:pr-8{padding-right:calc(var(--tw-spacing) * 8)}.tw\:lg\:pb-0{padding-bottom:calc(var(--tw-spacing) * 0)}.tw\:lg\:pb-0\.5{padding-bottom:calc(var(--tw-spacing) * .5)}.tw\:lg\:pb-1{padding-bottom:calc(var(--tw-spacing) * 1)}.tw\:lg\:pb-1\.5{padding-bottom:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:pb-2{padding-bottom:calc(var(--tw-spacing) * 2)}.tw\:lg\:pb-3{padding-bottom:calc(var(--tw-spacing) * 3)}.tw\:lg\:pb-4{padding-bottom:calc(var(--tw-spacing) * 4)}.tw\:lg\:pb-5{padding-bottom:calc(var(--tw-spacing) * 5)}.tw\:lg\:pb-6{padding-bottom:calc(var(--tw-spacing) * 6)}.tw\:lg\:pb-8{padding-bottom:calc(var(--tw-spacing) * 8)}.tw\:lg\:pl-0{padding-left:calc(var(--tw-spacing) * 0)}.tw\:lg\:pl-0\.5{padding-left:calc(var(--tw-spacing) * .5)}.tw\:lg\:pl-1{padding-left:calc(var(--tw-spacing) * 1)}.tw\:lg\:pl-1\.5{padding-left:calc(var(--tw-spacing) * 1.5)}.tw\:lg\:pl-2{padding-left:calc(var(--tw-spacing) * 2)}.tw\:lg\:pl-3{padding-left:calc(var(--tw-spacing) * 3)}.tw\:lg\:pl-4{padding-left:calc(var(--tw-spacing) * 4)}.tw\:lg\:pl-5{padding-left:calc(var(--tw-spacing) * 5)}.tw\:lg\:pl-6{padding-left:calc(var(--tw-spacing) * 6)}.tw\:lg\:pl-8{padding-left:calc(var(--tw-spacing) * 8)}.tw\:lg\:text-left{text-align:left}.tw\:lg\:text-center{text-align:center}.tw\:lg\:text-right{text-align:right}.tw\:lg\:line-clamp-1{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1}.tw\:lg\:line-clamp-2{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}.tw\:lg\:line-clamp-3{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}.tw\:lg\:scrollbar-none{scrollbar-width:none}.tw\:lg\:scrollbar-none::-webkit-scrollbar{display:none}}`;
