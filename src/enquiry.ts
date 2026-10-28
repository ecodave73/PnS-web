export const ENQUIRY_EMAIL = "enquiries@paintandsipevents.com.au";

const FIELDS = ["name", "email", "phone", "experience", "date", "location", "guests", "eventType", "message", "website"] as const;

/** Explicit allowlist: the browser cannot supply a recipient or mail headers. */
export function enquiryPayload(form: FormData): Record<typeof FIELDS[number], string> {
  return Object.fromEntries(FIELDS.map((field) => [field, String(form.get(field) ?? "")])) as Record<typeof FIELDS[number], string>;
}

export async function submitEnquiry(form: FormData, fetcher: typeof fetch = fetch): Promise<void> {
  let response: Response;
  try {
    response = await fetcher("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(enquiryPayload(form)),
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw new Error("We could not confirm your enquiry was sent. Your details are still here; please email or call Anthony before retrying to avoid a duplicate.");
  }

  let result: { success?: unknown; error?: unknown } | null = null;
  try {
    result = await response.json();
  } catch {
    // An HTML error page or missing receipt must never look like a successful send.
  }
  if (response.ok && result?.success === true) return;
  if (!response.ok && typeof result?.error === "string" && result.error.length <= 500) {
    throw new Error(result.error);
  }
  throw new Error("We could not confirm your enquiry was sent. Your details are still here; please email or call Anthony before retrying to avoid a duplicate.");
}
