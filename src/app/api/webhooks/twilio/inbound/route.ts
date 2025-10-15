import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Twilio sends application/x-www-form-urlencoded payloads by default
  const form = await req.formData();
  const from = form.get("From");
  const to = form.get("To");
  const body = form.get("Body");

  // In a real app, store/process inbound messages (DB, queue, etc.)
  console.log("Twilio inbound message:", { from, to, body });

  return new NextResponse("OK", { status: 200 });
}