import Stripe from "stripe";

export async function POST(request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecretKey || !webhookSecret) {
    console.error("Missing Stripe webhook environment variables");
    return new Response("Webhook Error: Missing Stripe environment variables", {
      status: 500,
    });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Webhook Error: Missing stripe-signature", {
      status: 400,
    });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-03-25.dahlia",
  });
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid signature";
    console.error(`Webhook signature verification failed: ${message}`);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email ?? session.customer_email;
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (email && apiKey && locationId) {
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
              email,
              tags: ["paid-customer"],
              customFields: [
                {
                  key: "price",
                  field_value: `$${((session.amount_total ?? 0) / 100).toString()}`,
                },
              ],
            }),
          },
        );
        if (!response.ok) {
          console.error(
            `GHL webhook update error ${response.status}:`,
            await response.text(),
          );
        }
      } catch (error) {
        console.error("GHL Webhook Update Error:", error);
      }
    }
  }

  return Response.json({ received: true });
}
