import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";

function isAuthorized(candidate, expected) {
  if (!candidate || !expected) return false;
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}

export async function POST(request) {
  const secret =
    process.env.SEO_REVALIDATE_SECRET || process.env.NEXT_REVALIDATE_SECRET;
  if (!secret)
    return Response.json(
      { error: "Revalidation is not configured." },
      { status: 503 },
    );
  if (!isAuthorized(request.headers.get("x-seo-revalidate-secret"), secret))
    return Response.json({ error: "Unauthorized." }, { status: 401 });

  revalidateTag("seo-settings");
  revalidateTag("seo-pages");
  revalidateTag("seo-sitemap");
  revalidateTag("page-content");
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
  return Response.json({ revalidated: true });
}
