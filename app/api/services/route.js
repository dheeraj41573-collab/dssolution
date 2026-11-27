import { NextResponse } from "next/server";
import { getServices } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = await getServices();
  return NextResponse.json(
    { services },
    {
      headers: { "Cache-Control": "no-store, max-age=0" },
    },
  );
}
