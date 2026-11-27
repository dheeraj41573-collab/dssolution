function json(data, status = 200) {
  return Response.json(data, { status });
}

export async function POST(request) {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.error(
      "Missing GHL_API_KEY or GHL_LOCATION_ID environment variables",
    );
    return json({ success: false, error: "Server misconfiguration" }, 500);
  }

  let body;
  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      body = await request.json();
    } else {
      body = Object.fromEntries(await request.formData());
    }
  } catch {
    return json({ success: false, error: "Invalid request body" }, 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!name || !email) {
    return json({ success: false, error: "Name and email are required" }, 400);
  }

  const [firstName, ...lastNameParts] = name.split(/\s+/);
  let response;
  try {
    response = await fetch(
      "https://services.leadconnectorhq.com/contacts/upsert",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Version: "2021-07-28",
        },
        body: JSON.stringify({
          locationId,
          firstName,
          lastName: lastNameParts.join(" "),
          email,
          tags: ["website-lead-generation"],
        }),
      },
    );
  } catch (error) {
    console.error("Lead generation request failed:", error);
    return json(
      { success: false, error: "An unexpected error occurred." },
      500,
    );
  }

  if (!response.ok) {
    const detail = await response.text();
    console.error(`GHL API error ${response.status}:`, detail);
    return json(
      { success: false, error: "Failed to submit. Please try again." },
      response.status,
    );
  }

  return json({ success: true });
}
