# Paint & Sip Events

**Purpose**: Conversion-focused website for private art master classes and live event illustration.

**Type**: Public marketing website

**Status**: Live in production

**Latest release — 2026-10-28**: Approved direct Resend submissions to `enquiries@paintandsipevents.com.au` are deployed. Source commit `7a400e7` is pushed to `main`. A labelled live browser test was accepted by Resend; recipient inbox receipt remains unconfirmed.

## What It Does

- Presents the Paint & Sip Events brand and its two signature services.
- Shows transparent master-class and illustration package pricing.
- Explains booking notice, preparation, inclusions and service regions.
- Collects event details and submits directly to the same-origin Worker, which sends a structured email to Anthony through Resend.
- Provides sending, success and error feedback; retains filled fields if sending fails and provides an explicit email fallback.
- Links to Anthony Pieters' artist portfolio, Instagram and phone contact.

## Data Stored

- No application database or browser persistence. Form data is sent to the Worker and Resend for email delivery to Anthony's mailbox; Resend and the mailbox provider handle their own message retention.

## Integrates With

- **Cloudflare Workers Static Assets**: deployment target configured in `wrangler.jsonc`.
- **Worker backend**: `worker/index.ts`, with `/api/enquiry` and `/api/enquiry/status`; requires securely configured `RESEND_API_KEY`. Existing production secret/status were verified before this task; no secrets were changed.
- **Resend**: fixed-recipient plain-text sending; no arbitrary-recipient relay. Logs contain request IDs/event names/provider HTTP status only, not visitor details or API credentials.
- **Fixed recipient**: `enquiries@paintandsipevents.com.au`. Sending address uses the verified Paint & Sip Events domain; replies go to the validated visitor email. Direct email fallback and footer use the same enquiries mailbox.
- **External links**: Anthony Pieters portfolio and Instagram profile.

## Deployment

- Worker name: `paint-and-sip-events`
- Intended domain: `paintandsipevents.com.au`
- Production routes: `paintandsipevents.com.au/*` and `www.paintandsipevents.com.au/*` over the existing proxied DNS records.
- Production URL: `https://paintandsipevents.com.au/`
- Workers preview: `https://paint-and-sip-events.david-d5b.workers.dev`
- Pre-release Cloudflare rollback reference, confirmed 2026-10-28: `0f99f962-20cb-481f-ab35-e75e122f6d54` (includes the provisioned Resend secret).
- Active release version: `c021c28b-e460-4b5e-a278-29b9c2082540`, deployed 2026-10-28 at 06:40 UTC to 100% of traffic. No DNS, secret or binding changes were made.
- Emergency rollback from this workspace: `npx wrangler rollback 0f99f962-20cb-481f-ab35-e75e122f6d54 --message "Restore pre-direct-form release"`. This restores the earlier mailto frontend/recipient; it does not undo DNS or mail-provider changes.

## Assets

- `public/images/masterclass-hero.webp`: generated and optimised hero image.
- `public/images/live-illustration.webp`: generated and optimised live illustration image.
- `public/images/studio-details.webp`: generated and optimised studio still life.
- Approved brand lockups and monogram are in `public/images/paint-sip-approved-{light,dark,monogram}.png`; approved PNG/ICO favicon assets are in `public/`.

## Backend safeguards and verification

- Strict JSON/field schema, same-origin root/www POST requirement, bounded streaming body reads, honeypot, five requests/minute per IP (approximate per Cloudflare location), and provider timeout/receipt checks.
- Generated binding/runtime types: `npm run types`; frontend and Worker type checks: `npm run check`.
- Deterministic tests: `npm test`; frontend submission contract and Worker safeguards use mock provider calls only, no real mail sent.
- Frontend uses native required/type/length/range validation plus authoritative backend validation, a honeypot, one in-flight submission, disabled controls while sending, accessible live/focused feedback, explicit provider success checks and a 20-second client timeout. Backend retains its shorter provider timeout and all existing abuse controls.
- Both `hello@paintandsipevents.com.au` and `enquiries@paintandsipevents.com.au` received external test mail successfully per David. Receipt of the new Resend-to-enquiries form test remains to be confirmed separately; API acceptance is not inbox confirmation.
- Pending-release verification 2026-10-28: sequential check, lint (typecheck alias), production build, 18 mocked tests (6 browser-contract + 12 Worker), Wrangler dry-run and git diff whitespace check passed. Local built-site browser smoke verified native required-field blocking, same-origin payload, pending/disabled state, duplicate in-flight blocking, success reset/focus, 429 error retention/alert/focus, and 390px mobile no-overflow/email link. Browser transport was explicitly mocked; no real email was sent. Screenshots: `/tmp/opencode/pns-form-mobile-error.png`, `/tmp/opencode/pns-form-desktop.png`.
- Production verification 2026-10-28: root/www HTTP 200, both serve the new JS asset `/assets/index-9l7k4M7i.js`, status configured:true, and deployment status confirms the new version at 100%. Exactly one labelled real browser enquiry (`PNS-FORM-20261028-1642`, no booking requested) returned HTTP 200/success:true, reset the form and focused its success feedback. The Worker tail recorded `enquiry_accepted`, request ID `90d2ca62-dea1-4546-84d5-d7e01861e9ee`, outcome ok and no exceptions. A separate www/390px invalid-phone test was rejected without sending mail, retained details and focused its error alert; no horizontal overflow or browser errors. Evidence: `/tmp/opencode/pns-production-success-20261028.png`, `/tmp/opencode/pns-production-mobile-validation-20261028.png`. Remaining check: David confirms the labelled email reached the enquiries inbox.
