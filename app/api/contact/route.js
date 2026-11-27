function json(data, status = 200) {
  return Response.json(data, { status });
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid JSON body" }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ success: false, error: "Invalid form submission" }, 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !phone || !message) {
    return json(
      { success: false, error: "Name, email, phone and message are required" },
      400,
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ success: false, error: "Enter a valid email address" }, 400);
  }
  if (
    name.length > 120 ||
    email.length > 254 ||
    phone.length > 40 ||
    message.length > 5000
  ) {
    return json(
      { success: false, error: "One or more fields exceed the allowed length" },
      400,
    );
  }

  const cmsApiUrl = (
    process.env.NEXT_PUBLIC_CMS_API_URL ||
    "https://digital-solution-1-h8nk.onrender.com/api"
  ).replace(/\/$/, "");
  let submissionResponse;
  try {
    submissionResponse = await fetch(`${cmsApiUrl}/contact-submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    });
  } catch (error) {
    console.error("CMS contact submission request failed:", error.message);
    return json(
      {
        success: false,
        error: "We could not save your message. Please try again shortly.",
      },
      502,
    );
  }

  if (!submissionResponse.ok) {
    console.error(
      `CMS contact submission failed with HTTP ${submissionResponse.status}`,
    );
    return json(
      {
        success: false,
        error: "We could not save your message. Please try again shortly.",
      },
      502,
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationFrom = process.env.CONTACT_NOTIFICATION_FROM;
  const notificationEmail =
    process.env.CONTACT_NOTIFICATION_EMAIL || "info@thedssolution.com";

  let notificationWarning = "";
  if (!resendApiKey || !notificationFrom) {
    console.error(
      "Missing RESEND_API_KEY or CONTACT_NOTIFICATION_FROM environment variables",
    );
    notificationWarning =
      "Your message was received, but email notification is not configured. Our team can still see it in the admin inbox.";
  } else {
    const escapedMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");
    const textContent = `A new message was sent from the website contact form.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`;

    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Digital Solution Website <${notificationFrom}>`,
          to: [notificationEmail],
          reply_to: email,
          subject: "New website contact form message",
          text: textContent,
          html: `<h2>New website contact form message</h2><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Message:</strong><br>${escapedMessage}</p>`,
        }),
      });

      if (!emailResponse.ok) {
        const responseText = await emailResponse.text();
        let detail = "";
        try {
          const responseBody = JSON.parse(responseText);
          if (typeof responseBody.message === "string") {
            detail = responseBody.message;
          } else if (typeof responseBody.name === "string") {
            detail = responseBody.name;
          }
        } catch {
          detail = "";
        }
        detail = detail
          .split(resendApiKey)
          .join("[redacted]")
          .replace(/\s+/g, " ")
          .slice(0, 240);
        console.error(
          `Resend API error ${emailResponse.status}${detail ? `: ${detail}` : ""}`,
        );
        notificationWarning =
          "Your message was received, but the email notification could not be sent. Our team can still see it in the admin inbox.";
      }
    } catch (error) {
      console.error("Resend notification request failed:", error.message);
      notificationWarning =
        "Your message was received, but the email notification could not be sent. Our team can still see it in the admin inbox.";
    }
  }

  return json({ success: true, notificationWarning });
}
