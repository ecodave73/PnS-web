# Paint & Sip Events

**Purpose**: Conversion-focused website for private art master classes and live event illustration.

**Type**: Public marketing website

**Status**: Live in production

**Pending local release**: User approved direct Resend submissions and the fixed recipient `enquiries@paintandsipevents.com.au` on 2026-10-28. Implementation is prepared locally; this task has not committed, pushed or deployed it.

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
- Pre-release active Cloudflare version, confirmed 2026-10-28: `0f99f962-20cb-481f-ab35-e75e122f6d54` (includes the provisioned Resend secret). Retain as the rollback reference; record the new version after release verification.

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
- Both `hello@paintandsipevents.com.au` and `enquiries@paintandsipevents.com.au` received external test mail successfully per David. Main agent must verify the newly deployed form and actual Resend-to-enquiries delivery separately; API acceptance is not inbox confirmation.
- Pending-release verification 2026-10-28: sequential check, lint (typecheck alias), production build, 18 mocked tests (6 browser-contract + 12 Worker), Wrangler dry-run and git diff whitespace check passed. Local built-site browser smoke verified native required-field blocking, same-origin payload, pending/disabled state, duplicate in-flight blocking, success reset/focus, 429 error retention/alert/focus, and 390px mobile no-overflow/email link. Browser transport was explicitly mocked; no real email was sent. Screenshots: `/tmp/opencode/pns-form-mobile-error.png`, `/tmp/opencode/pns-form-desktop.png`.
