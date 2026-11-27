import Stripe from "stripe";

function json(data, status = 200) {
  return Response.json(data, { status });
}

export async function POST(request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error("Missing STRIPE_SECRET_KEY environment variable");
    return json({ success: false, error: "Stripe configuration error" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid JSON body" }, 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const planTitle =
    typeof body.planTitle === "string" ? body.planTitle : "Plan";
  const price = Number(body.price);
  const interval = body.interval === "year" ? "year" : "month";

  if (!name || !email) {
    return json({ success: false, error: "Name and email are required" }, 400);
  }
  if (!Number.isFinite(price) || price <= 0) {
    return json(
      { success: false, error: "A valid plan price is required" },
      400,
    );
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (apiKey && locationId) {
    const [firstName, ...lastNameParts] = name.split(/\s+/);
    try {
      const response = await fetch(
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
            tags: ["checkout-initiated", planTitle],
          }),
        },
      );
      if (!response.ok) {
        console.error(
          `GHL checkout contact error ${response.status}:`,
          await response.text(),
        );
      }
    } catch (error) {
      console.error("GHL integration error during checkout:", error);
    }
  }

  try {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-03-25.dahlia",
    });
    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: planTitle },
            unit_amount: Math.round(price * 100),
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
    });

    return json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe Checkout error:", error);
    return json(
      { success: false, error: "Unable to start checkout. Please try again." },
      500,
    );
  }
}
