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
npm test
npm run build
```

## Cloudflare Workers

The site is configured as a Worker with static assets using `wrangler.jsonc`, with root and `www` Worker routes over the existing proxied DNS records. The backend entrypoint (`worker/index.ts`) makes Worker runtime secrets available; `/api/*` invokes the Worker first and ordinary site assets remain asset-first.

```bash
npm run deploy
```

The deploy script builds and then publishes to the `paint-and-sip-events` Worker at `paintandsipevents.com.au` and `www.paintandsipevents.com.au`.

## Enquiry behaviour

The frontend is deliberately unchanged for this release: it still prepares an email in the visitor's own email application, addressed to `hello@anthonypietersartist.com`. This keeps existing enquiries available until Resend credentials and real delivery have been verified.

The new backend provides:

- `GET /api/enquiry/status`: returns only `{ "configured": true | false }` according to whether `RESEND_API_KEY` exists. This is a configuration check, not proof that the key works or that mail reaches an inbox.
- `POST /api/enquiry`: sends a plain-text Resend email to the fixed recipient `hello@anthonypietersartist.com`, from `Paint & Sip Events <enquiries@paintandsipevents.com.au>`, with the validated visitor email as `reply_to`.
- Required string fields: `name`, `email`, `phone`, `experience`, `date`, `location`, `guests`, `eventType`. Optional string fields: `message`, `website` (honeypot; must remain empty). `experience` must match an existing frontend option, and `guests` must be an integer string from 1–10,000. Unknown fields are rejected.
- Exact same-origin root/`www` checks, JSON-only bodies, 16 KiB body limit, field limits, a 10-second body/provider timeout, a honeypot and a five-request/minute per-IP Cloudflare rate limiter. The IP is hashed before use as a rate-limit key and not logged. Cloudflare rate limits are approximate and per location, not a strict global abuse budget.
- Missing credentials return HTTP 503. Rejected/uncertain provider receipts return HTTP 502, never a false success. The backend stores no enquiry database; Resend processes email details, so privacy copy must reflect that when direct submission is connected.

### Configure Resend after the backend release

After deploying the backend-enabled Worker, add a **Secret** named `RESEND_API_KEY` in Cloudflare **Workers & Pages → paint-and-sip-events → Settings → Variables and Secrets**. Use a sending key authorised for `paintandsipevents.com.au`. Never put the key in GitHub, frontend code, or chat. For local testing only, an ignored `.dev.vars` may contain the secret; it is never uploaded automatically.

Then verify `/api/enquiry/status`, send one authorised real test enquiry, check provider acceptance and recipient delivery, and only then update the frontend to use direct submission. `status.configured` alone is not a delivery test. No real email was sent by the included tests.

### Backend development and types

```bash
npm run types
npm run build
npx wrangler dev
```

`npm run dev` remains the frontend-only Vite server. Backend tests run through Node's type-stripping test runner (Node 22.6+); production runtime smoke checks should also use Wrangler/workerd. Generated binding/runtime declarations are in `worker-configuration.d.ts`; the secret remains an optional extension because first deployment must work before it is added. Regenerate types after changing bindings.

Reference docs: [asset routing](https://developers.cloudflare.com/workers/static-assets/binding/), [rate limits](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [Resend send API](https://resend.com/docs/api-reference/emails/send-email).
