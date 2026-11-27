// AI chat endpoint. Needs ANTHROPIC_API_KEY in .env.local (optional: CHAT_MODEL).
const MODEL = process.env.CHAT_MODEL || "claude-haiku-5-5";
const WHATSAPP = "https://wa.me/919988051081";

const SYSTEM = `You are the website assistant of DS Solution, a founder-led digital marketing agency in Mohali, Punjab, India.
Services: SEO, local SEO, Google Ads (PPC), Meta Ads, social media marketing (SMM), web development / custom web apps, graphic design and brand identity, UGC/reels, email and WhatsApp marketing, influencer marketing, B2B lead generation, ecommerce scaling, CRO, dashboards and AI automation. Serves 89+ industries across India and internationally (USA, UK, Canada, Australia, Dubai, Singapore, Malaysia).
SMM monthly plans (starting scopes, ad spend extra): Starter Rs 5,999 (2 platforms, 12 posts, 3 reels), Growth Rs 7,999 (3 platforms, 20 posts, 8 reels, Meta Ads setup), Scale Rs 11,999 (4 platforms, 30 posts, 12 reels, Meta Ads management).
Contact: phone +91 88721 50361, WhatsApp ${WHATSAPP}, contact form at /contact. Office hours Mon-Sat 9 AM-6 PM IST.
Rules: always reply in English, even if the user writes in another language. Keep answers short (2-5 sentences). Only state prices that are listed above; for any other pricing or custom quotes, say it depends on scope and invite them to share details on /contact or WhatsApp. Never invent case studies, guarantees or results. If unsure, say so and point to the team. Stay on topic (DS Solution and digital marketing/business growth).`;

// very small in-memory rate limit (per server instance)
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 12;
}

export async function POST(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return Response.json(
      { reply: "Too many messages. Please try again in a minute." },
      { status: 429 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({
      reply: `AI chat isn't set up yet. You can message us on WhatsApp: ${WHATSAPP}`,
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ reply: "Invalid request." }, { status: 400 });
  }

  // sanitise: last 10 messages, valid roles, capped length, must start with user
  let messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter(
      (m) =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim(),
    )
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length)
    return Response.json(
      { reply: "Please type your question." },
      { status: 400 },
    );

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: SYSTEM,
        messages,
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
    const data = await res.json();
    const reply = data.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return Response.json({
      reply: reply || "Sorry, I couldn't get an answer.",
    });
  } catch (error) {
    console.error("chat error:", error);
    return Response.json({
      reply: `I can't reach the AI right now. You can chat with us on WhatsApp: ${WHATSAPP}`,
    });
  }
}
