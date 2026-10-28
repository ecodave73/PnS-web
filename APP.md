# Paint & Sip Events

**Purpose**: Conversion-focused website for private art master classes and live event illustration.

**Type**: Public marketing website

**Status**: Live in production

**Pending local release**: Worker enquiry backend prepared; not deployed by this task. Frontend remains on mailto until credentials and delivery are verified.

## What It Does

- Presents the Paint & Sip Events brand and its two signature services.
- Shows transparent master-class and illustration package pricing.
- Explains booking notice, preparation, inclusions and service regions.
- Collects event details and prepares a structured email to Anthony.
- Links to Anthony Pieters' artist portfolio, Instagram and phone contact.

## Data Stored

- None. The enquiry form opens the visitor's email client and does not send or persist form data itself.

## Integrates With

- **Cloudflare Workers Static Assets**: deployment target configured in `wrangler.jsonc`.
- **Worker backend**: `worker/index.ts`, with `/api/enquiry` and `/api/enquiry/status`; requires securely configured `RESEND_API_KEY` for direct mail. Backend changes are prepared locally and are not deployed yet.
- **Resend**: fixed-recipient plain-text sending; no arbitrary-recipient relay. Logs contain request IDs/event names/provider HTTP status only, not visitor details or API credentials.
- **Email client**: `mailto:` enquiry handoff to `hello@anthonypietersartist.com`.
- **External links**: Anthony Pieters portfolio and Instagram profile.

## Deployment

- Worker name: `paint-and-sip-events`
- Intended domain: `paintandsipevents.com.au`
- Production routes: `paintandsipevents.com.au/*` and `www.paintandsipevents.com.au/*` over the existing proxied DNS records.
- Production URL: `https://paintandsipevents.com.au/`
- Workers preview: `https://paint-and-sip-events.david-d5b.workers.dev`
- Cloudflare version deployed 2026-10-28: `4a234a9f-5793-4fda-b4ca-04fd1cf928ba`.

## Assets

- `public/images/masterclass-hero.webp`: generated and optimised hero image.
- `public/images/live-illustration.webp`: generated and optimised live illustration image.
- `public/images/studio-details.webp`: generated and optimised studio still life.
- Approved brand lockups and monogram are in `public/images/paint-sip-approved-{light,dark,monogram}.png`; approved PNG/ICO favicon assets are in `public/`.

## Backend safeguards and verification

- Strict JSON/field schema, same-origin root/www POST requirement, bounded streaming body reads, honeypot, five requests/minute per IP (approximate per Cloudflare location), and provider timeout/receipt checks.
- Generated binding/runtime types: `npm run types`; frontend and Worker type checks: `npm run check`.
- Deterministic tests: `npm test`; mock provider calls only, no real mail sent.
- Direct form integration and real Resend delivery remain gated on securely adding the sending key after the backend deployment.
