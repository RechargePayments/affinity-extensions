# Referral

tag: `rc-referral`

Shows the customer's Recharge referral link in the customer portal, with a three-step explainer, a copy button, and share links for WhatsApp, text message, email, and the device share sheet.

## What it does

- Fetches the customer's referral URL with the Recharge SDK
- Shows a "how it works" timeline (share your link, your friend orders, you earn credit)
- Copies the link to the clipboard, with a `Copied!` confirmation
- Offers share links for WhatsApp, SMS, and email, plus the native share sheet where the browser supports it
- Shows an example link and a notice if the real referral link can't be loaded (see [Fallback](#fallback))

## Requirements

- Referrals is enabled on the Recharge account.
- An active **Incentivize friends** flow exists, so referral URLs are generated for customers.

## Configuration

| Setting | Description |
|---|---|
| `STORE_IDENTIFIER` | Shopify domain used to initialize the Recharge SDK, for example `your-store.myshopify.com`. No protocol or trailing slash. |
| `STOREFRONT_ACCESS_TOKEN` | Storefront access token used to initialize the Recharge SDK. It must be a **Storefront** type token (starts with `strfnt`). |
| `AFF_CSS` and `TW_CSS` | Paste the shared framework constants from [`css-constants.js`](../css-constants.js). |

Copy can be changed without editing the file, using attributes on the element:

| Attribute | Default |
|---|---|
| `heading` | `Introduce your friends to us.` |
| `step-1-title`, `step-2-title`, `step-3-title` | `Share your link`, `Your friend orders`, `You earn credit` |
| `step-1-body`, `step-2-body`, `step-3-body` | Short description for each step |
| `share-message` | `Use my link for a discount on your first order:` |
| `email-subject` | `A little something for you` |
| `fallback-url` | `https://rc-refer.com/example123` |
| `hide-fallback-notice` | Present to hide the fallback notice |

Before publishing the sample, replace `STORE_IDENTIFIER` and `STOREFRONT_ACCESS_TOKEN` with the values for the destination store.

The extension injects a small `#rc-referral-css` stylesheet for the steps timeline and share bar, on top of the shared `#aff-framework` and `#tw-css` styles.

## How it works

On mount, the extension initializes the Recharge JavaScript SDK (loading version 1.89.0 if the page does not already have a compatible one) and logs the customer in. It then calls `customer.getCustomer(session, { include: ['referral_info'] })`.

The API returns included data under `customer.include`, so the referral link is read from `customer.include.referral_info.referral_url`. The `customer.referral_info.referral_url` path shown in the SDK docs example is also checked.

The session is cached on `window` under the same keys as the other extensions, so extensions on the same page share one login.

## Fallback

If the response has no referral URL, or the request fails, the extension logs the response or error to the console and renders an example link with a notice. Remove this behaviour, or set a real `fallback-url`, before showing the extension to customers if you don't want them to see an example link.

## Add it to the customer portal

1. Host `rc-referral.js` where it is accessible to the customer portal.
2. In Recharge, open **Storefront** > **Customer portal** > theme > **Home page** > **Customize**.
3. Add a **Custom extension** section and enter the hosted file URL.
4. Set the tag name to `rc-referral`.
5. Save, position the extension, and enable visibility for customers when ready.
