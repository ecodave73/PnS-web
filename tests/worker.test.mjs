import assert from "node:assert/strict";
import test from "node:test";
import { handleRequest } from "../worker/index.ts";

const ROOT = "https://paintandsipevents.com.au";
const valid = {
  name: "Test Guest", email: "guest@example.com", phone: "0450 000 000",
  experience: "Art Master Class", date: "14 March, 5:30pm", location: "Gold Coast",
  guests: "8", eventType: "Birthday", message: "Portraiture, please.", website: "",
};
function env(overrides = {}) {
  return {
    ASSETS: { fetch: async () => new Response("static asset") },
    ENQUIRY_RATE_LIMITER: { limit: async () => ({ success: true }) },
    RESEND_API_KEY: "test-only-secret",
    ...overrides,
  };
}
function request(body = valid, options = {}) {
  return new Request(`${ROOT}/api/enquiry`, {
    method: "POST", headers: { Origin: ROOT, "Content-Type": "application/json", ...options.headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
const neverSend = async () => { throw new Error("Unexpected provider request"); };

test("status reveals only configured boolean, without secrets", async () => {
  for (const [secret, expected] of [[undefined, false], ["", false], ["test-secret", true]]) {
    const response = await handleRequest(new Request(`${ROOT}/api/enquiry/status`), env({ RESEND_API_KEY: secret }), neverSend);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(await response.json(), { configured: expected });
  }
});
test("static requests use the ASSETS binding, unknown API paths are JSON 404", async () => {
  assert.equal(await (await handleRequest(new Request(`${ROOT}/`), env(), neverSend)).text(), "static asset");
  assert.equal((await handleRequest(new Request(`${ROOT}/api/not-a-route`), env(), neverSend)).status, 404);
});
test("methods are restricted, including status endpoint", async () => {
  const response = await handleRequest(new Request(`${ROOT}/api/enquiry`), env(), neverSend);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "POST");
  assert.equal((await handleRequest(new Request(`${ROOT}/api/enquiry/status`, { method: "POST" }), env(), neverSend)).status, 405);
});
test("rejects cross-origin, missing, null, subdomain-like and cross-site requests", async () => {
  for (const origin of ["https://attacker.example", "null", "https://paintandsipevents.com.au.attacker.example", "https://www.paintandsipevents.com.au"]) {
    assert.equal((await handleRequest(request(valid, { headers: { Origin: origin } }), env(), neverSend)).status, 403);
  }
  const missingOrigin = request();
  missingOrigin.headers.delete("Origin");
  assert.equal((await handleRequest(missingOrigin, env(), neverSend)).status, 403);
  assert.equal((await handleRequest(request(valid, { headers: { "Sec-Fetch-Site": "cross-site" } }), env(), neverSend)).status, 403);
});
test("rejects non-JSON, malformed JSON and unknown fields", async () => {
  assert.equal((await handleRequest(request(valid, { headers: { "Content-Type": "text/plain" } }), env(), neverSend)).status, 415);
  for (const payload of ["{", "null", "[]", JSON.stringify({ ...valid, to: "attacker@example.com" }), JSON.stringify({ ...valid, constructor: "ignored" })]) {
    assert.equal((await handleRequest(request(payload), env(), neverSend)).status, 400);
  }
});
test("enforces input lengths, required values, header safety, experience and guest counts", async () => {
  for (const payload of [
    { ...valid, name: "A".repeat(101) }, { ...valid, name: "\r\nInjected: yes" },
    { ...valid, email: "invalid" }, { ...valid, email: "guest@example.com\r\nBcc:a@b.com" },
    { ...valid, guests: "0" }, { ...valid, guests: "10001" }, { ...valid, guests: 8 },
    { ...valid, guests: "1.5" }, { ...valid, phone: "not-a-number" }, { ...valid, phone: "-----" },
    { ...valid, experience: "Bad experience" }, { ...valid, message: "A".repeat(4001) },
    { ...valid, location: " " }, { ...valid, website: "bot.example" },
  ]) assert.equal((await handleRequest(request(payload), env(), neverSend)).status, 400);
});
test("body bytes are bounded both with Content-Length and without it", async () => {
  assert.equal((await handleRequest(request("{}", { headers: { "Content-Length": "99999" } }), env(), neverSend)).status, 413);
  assert.equal((await handleRequest(request(" ".repeat(16385)), env(), neverSend)).status, 413);
  const stream = new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(10000)); controller.enqueue(new Uint8Array(10000)); controller.close(); },
  });
  const streamed = new Request(`${ROOT}/api/enquiry`, { method: "POST", headers: { Origin: ROOT, "Content-Type": "application/json" }, body: stream, duplex: "half" });
  assert.equal((await handleRequest(streamed, env(), neverSend)).status, 413);
});
test("missing secret fails safely with 503 and no mail attempt", async () => {
  const response = await handleRequest(request(), env({ RESEND_API_KEY: undefined }), neverSend);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).success, undefined);
});
test("rate limiter blocks sending and sets Retry-After", async () => {
  let rateKey;
  const response = await handleRequest(request(valid, { headers: { "CF-Connecting-IP": "192.0.2.1" } }), env({ ENQUIRY_RATE_LIMITER: { limit: async ({ key }) => { rateKey = key; return { success: false }; } } }), neverSend);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "60");
  assert.match(rateKey, /^enquiry:[a-f0-9]{64}$/);
  assert.ok(!rateKey.includes("192.0.2.1"));
});
test("provider acceptance sends fixed addresses, validated reply-to and plain text only", async () => {
  let sent;
  const response = await handleRequest(request(), env(), async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(options.method, "POST");
    assert.equal(options.headers.Authorization, "Bearer test-only-secret");
    assert.match(options.headers["Idempotency-Key"], /^enquiry-/);
    assert.ok(options.signal instanceof AbortSignal);
    sent = JSON.parse(options.body);
    return Response.json({ id: "provider-email-id" });
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(sent.from, "Paint & Sip Events <enquiries@paintandsipevents.com.au>");
  assert.deepEqual(sent.to, ["hello@anthonypietersartist.com"]);
  assert.equal(sent.reply_to, valid.email);
  assert.ok(!("html" in sent));
  assert.match(sent.text, /Name: Test Guest/);
});
test("www same-origin submissions are allowed", async () => {
  const origin = "https://www.paintandsipevents.com.au";
  const response = await handleRequest(new Request(`${origin}/api/enquiry`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify(valid) }), env(), async () => Response.json({ id: "accepted" }));
  assert.equal(response.status, 200);
});
test("provider rejection, network/timeout errors and missing receipts never claim success", async () => {
  for (const fetcher of [
    async () => Response.json({ message: "private provider detail" }, { status: 403 }),
    async () => { throw new Error("network with secret details"); },
    async () => { throw new DOMException("timeout", "TimeoutError"); },
    async () => Response.json({}),
    async () => new Response("not-json"),
    async () => new Response("X".repeat(5000)),
  ]) {
    const response = await handleRequest(request(), env(), fetcher);
    assert.equal(response.status, 502);
    const text = await response.text();
    assert.ok(!text.includes("private provider detail"));
    assert.ok(!text.includes("secret details"));
    assert.ok(!text.includes('"success":true'));
  }
});
