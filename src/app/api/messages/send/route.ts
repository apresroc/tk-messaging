import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import Twilio from "twilio";

export const runtime = "nodejs";

const settingsPath = path.join(process.cwd(), "data", "settings.json");

type SendRequest = {
  to: string;
  body?: string;
  media?: string[];
};

async function getSettings() {
  try {
    const raw = await readFile(settingsPath, "utf-8");
    return JSON.parse(raw) as {
      twilioAccountSid: string;
      twilioAuthToken: string;
      twilioPhoneNumber: string;
    };
  } catch {
    return { twilioAccountSid: "", twilioAuthToken: "", twilioPhoneNumber: "" };
  }
}

export async function POST(req: NextRequest) {
  const { to, body, media }: SendRequest = await req.json();

  if (!to || (!body && (!media || media.length === 0))) {
    return NextResponse.json({ success: false, error: "Missing to or content" }, { status: 400 });
  }

  const { twilioAccountSid, twilioAuthToken, twilioPhoneNumber } = await getSettings();

  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    return NextResponse.json({ success: false, error: "Twilio settings not configured" }, { status: 400 });
  }

  const client = Twilio(twilioAccountSid, twilioAuthToken);

  const message = await client.messages.create({
    to,
    from: twilioPhoneNumber,
    body,
    mediaUrl: media && media.length > 0 ? media : undefined,
  });

  return NextResponse.json({ success: true, messageId: message.sid, status: "sent" });
}