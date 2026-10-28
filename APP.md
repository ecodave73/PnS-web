# Paint & Sip Events

**Purpose**: Conversion-focused website for private art master classes and live event illustration.

**Type**: Public marketing website

**Status**: Live in production

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
- Inline SVG identity is implemented in `src/App.tsx`.
