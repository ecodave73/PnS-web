import assert from "node:assert/strict";
import test from "node:test";
import { ENQUIRY_EMAIL, enquiryPayload, submitEnquiry } from "../src/enquiry.ts";

function details() {
  const form = new FormData();
  for (const [key, value] of Object.entries({ name: "Test Guest", email: "guest@example.com", phone: "0450 000 000", experience: "Art Master Class", date: "14 March, 5:30pm", location: "Gold Coast", guests: "8", eventType: "Birthday", message: "Portraiture, please." })) form.set(key, value);
  return form;
}

test("browser payload includes all expected fields and excludes recipient overrides", () => {
  const form = details();
  form.set("to", "attacker@example.com");
  const payload = enquiryPayload(form);
  assert.equal(ENQUIRY_EMAIL, "enquiries@paintandsipevents.com.au");
  assert.equal(Object.keys(payload).length, 10);
  assert.equal(payload.website, "");
  assert.equal(payload.guests, "8");
  assert.equal(payload.to, undefined);
});
test("honeypot value is sent for server validation, not silently discarded", () => {
  const form = details();
  form.set("website", "bot.example");
  assert.equal(enquiryPayload(form).website, "bot.example");
});
test("direct submission POSTs same-origin JSON and requires explicit success", async () => {
  await submitEnquiry(details(), async (url, options) => {
    assert.equal(url, "/api/enquiry");
    assert.equal(options.method, "POST");
    assert.equal(options.credentials, "same-origin");
    assert.equal(options.headers["Content-Type"], "application/json");
    assert.ok(options.signal instanceof AbortSignal);
    assert.deepEqual(JSON.parse(options.body), enquiryPayload(details()));
    return Response.json({ success: true });
  });
});
test("validation, unavailable-provider and throttling responses preserve helpful errors", async () => {
  for (const [status, error] of [[400, "Please check the phone field."], [429, "Too many enquiries. Please wait a minute before trying again."], [502, "Your enquiry could not be sent. Please try again or contact Anthony directly."], [503, "Direct enquiries are being configured. Please email or call Anthony for now."]]) {
    await assert.rejects(submitEnquiry(details(), async () => Response.json({ error }, { status })), { message: error });
  }
});
test("non-JSON, absent, false or unsuccessful HTTP receipts never claim success", async () => {
  for (const response of [new Response("<html>error</html>"), Response.json({}), Response.json({ success: false }), Response.json({ success: true }, { status: 500 }), Response.json(null)]) {
    await assert.rejects(submitEnquiry(details(), async () => response), /could not confirm/);
  }
});
test("network and timeout errors retain fields and warn about uncertain delivery", async () => {
  const form = details();
  for (const error of [new Error("private network details"), new DOMException("timeout", "TimeoutError")]) {
    await assert.rejects(submitEnquiry(form, async () => { throw error; }), /before retrying to avoid a duplicate/);
  }
  assert.equal(form.get("name"), "Test Guest");
});
