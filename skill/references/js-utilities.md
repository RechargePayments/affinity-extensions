# JS Utilities

Four self-contained utilities for modal, toast, tabs, and stepper interactions. Copy only the ones your extension needs — paste each as a `const` string and inject it into a `<script type="module">` tag, or inline as a Blob URL.

The simplest pattern: inline each utility as a module using a `<script type="module">` injected into the shadow-free component's `connectedCallback`, or register them as module constants and call `init*` directly after the component renders.

---

## aff-modal.js

Wires open/close triggers, backdrop click, and Escape key.

| Data attribute | Element | Effect |
|---|---|---|
| `data-modal-open="id"` | any button | opens the `.aff-modal-wrapper` with that id |
| `data-modal-close` | button inside wrapper | closes the containing wrapper |

```js
// Programmatic use
openModal(document.querySelector('#my-modal'));
closeModal(document.querySelector('#my-modal'));
```

**Full source — copy into extension:**

```js
export function openModal(wrapper) {
  if (!wrapper) return;
  wrapper.classList.add('is-open');
  wrapper.setAttribute('aria-hidden', 'false');
  const focusable = wrapper.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusable?.focus();
}

export function closeModal(wrapper) {
  if (!wrapper) return;
  wrapper.classList.remove('is-open');
  wrapper.setAttribute('aria-hidden', 'true');
}

export function initModal(root = document) {
  root.querySelectorAll('[data-modal-open]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const wrapper = root.querySelector(`#${trigger.dataset.modalOpen}`);
      openModal(wrapper);
    });
  });

  root.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.aff-modal-wrapper');
      closeModal(wrapper);
    });
  });

  root.querySelectorAll('.aff-modal-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
      if (e.target === wrapper) closeModal(wrapper);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    root.querySelectorAll('.aff-modal-wrapper.is-open').forEach(wrapper => {
      closeModal(wrapper);
    });
  });
}
```

---

## aff-toast.js

Shows/hides toast notifications. Auto-dismisses after 4 seconds by default.

| Data attribute | Element | Effect |
|---|---|---|
| `data-toast-show="id"` | any button | shows the `.aff-toast-wrapper` with that id |
| `data-toast-duration="ms"` | same button | overrides auto-dismiss duration (0 = no auto-dismiss) |
| `data-toast-close` | button inside wrapper | hides the containing wrapper |

```js
// Programmatic use
showToast(document.querySelector('#my-toast'), 3000); // 3s auto-dismiss
hideToast(document.querySelector('#my-toast'));
```

**Full source — copy into extension:**

```js
export function showToast(el, duration = 4000) {
  if (!el) return;
  el.hidden = false;
  el.removeAttribute('style');
  clearTimeout(el._hideTimer);
  if (duration > 0) {
    el._hideTimer = setTimeout(() => hideToast(el), duration);
  }
}

export function hideToast(el) {
  if (!el) return;
  clearTimeout(el._hideTimer);
  el.hidden = true;
}

export function initToast(root = document) {
  root.querySelectorAll('[data-toast-show]').forEach(trigger => {
    const duration = trigger.dataset.toastDuration !== undefined
      ? parseInt(trigger.dataset.toastDuration, 10)
      : 4000;
    trigger.addEventListener('click', () => {
      const toast = root.querySelector(`#${trigger.dataset.toastShow}`);
      showToast(toast, duration);
    });
  });

  root.querySelectorAll('[data-toast-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.aff-toast-wrapper');
      hideToast(wrapper);
    });
  });

  root.querySelectorAll('.aff-toast-close[data-toast]').forEach(btn => {
    btn.addEventListener('click', () => {
      const toast = root.querySelector(`#${btn.dataset.toast}`);
      hideToast(toast);
    });
  });
}
```

---

## aff-tabs.js

Wires tab switching with ARIA state management and keyboard navigation (arrow keys).

No data attributes needed — discovers tabs by `role="tablist"`, `role="tab"`, and `aria-controls`.

The first tab should have `aria-selected="true"` and its panel `class="aff-tab-panel is-active"`. All other tabs get `tabindex="-1"`.

**Full source — copy into extension:**

```js
export function initTabs(root = document) {
  root.querySelectorAll('[role="tablist"].aff-tabs').forEach(tablist => {
    const tabs = [...tablist.querySelectorAll('[role="tab"].aff-tab')];

    tabs.forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab, tabs, root));

      tab.addEventListener('keydown', (e) => {
        const idx = tabs.indexOf(tab);
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          activateTab(tabs[(idx + 1) % tabs.length], tabs, root);
          tabs[(idx + 1) % tabs.length].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          activateTab(tabs[(idx - 1 + tabs.length) % tabs.length], tabs, root);
          tabs[(idx - 1 + tabs.length) % tabs.length].focus();
        }
      });
    });
  });
}

function activateTab(tab, tabs, root) {
  tabs.forEach(t => {
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
  });

  tab.setAttribute('aria-selected', 'true');
  tab.removeAttribute('tabindex');

  const panelId = tab.getAttribute('aria-controls');
  if (!panelId) return;

  const tablist = tabs[0]?.closest('[role="tablist"]');
  (tablist?.parentElement ?? root).querySelectorAll('.aff-tab-panel').forEach(p => p.classList.remove('is-active'));
  root.querySelector(`#${panelId}`)?.classList.add('is-active');
}
```

---

## aff-stepper.js

Wires +/− buttons on a number input. Handles min/max clamping, disables buttons at limits, and fires a `change` event on the input when the value updates.

| Data attribute | Element | Effect |
|---|---|---|
| `data-stepper-dec` | button | decrements the input value |
| `data-stepper-inc` | button | increments the input value |
| `data-stepper-val` | `<input type="number">` | the value field |

Fallback: if data attributes are absent, the utility also recognises `aria-label="Decrease"` / `aria-label="Increase"`.

**Full source — copy into extension:**

```js
export function initStepper(root = document) {
  const steppers = root.matches?.('.aff-stepper')
    ? [root]
    : [...root.querySelectorAll('.aff-stepper')];

  steppers.forEach(stepper => {
    const input = stepper.querySelector('[data-stepper-val]') || stepper.querySelector('input[type="number"]');
    const dec = stepper.querySelector('[data-stepper-dec]') || stepper.querySelector('[aria-label="Decrease"]');
    const inc = stepper.querySelector('[data-stepper-inc]') || stepper.querySelector('[aria-label="Increase"]');

    if (!input || !dec || !inc) return;

    const update = (delta) => {
      const val = parseInt(input.value, 10);
      const min = parseInt(input.min, 10) || 1;
      const max = parseInt(input.max, 10) || Infinity;
      const next = Math.min(max, Math.max(min, val + delta));
      if (next !== val) {
        input.value = next;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      dec.disabled = next <= min;
      inc.disabled = next >= max;
    };

    dec.addEventListener('click', () => update(-1));
    inc.addEventListener('click', () => update(1));

    update(0);
  });
}
```
