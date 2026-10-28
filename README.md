# Paint & Sip Events

One-page React website for [paintandsipevents.com.au](https://paintandsipevents.com.au), presenting Anthony Pieters' private art master classes and live illustration services.

## Local development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run check
npm run lint
npm run build
```

## Cloudflare Workers

The site is configured as an assets-only Worker using `wrangler.jsonc`, with the root and `www` hostnames declared as Worker custom domains.

```bash
npm run deploy
```

The deploy script builds and then publishes to the `paint-and-sip-events` Worker at `paintandsipevents.com.au` and `www.paintandsipevents.com.au`.

## Enquiry behaviour

The form assembles the provided details into an email and opens the visitor's own email application, addressed to `hello@anthonypietersartist.com`. It deliberately stores no data and needs no backend. A transactional form endpoint can replace this later if direct submission is required.
