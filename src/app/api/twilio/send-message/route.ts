import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import twilio from "twilio";

const SETTINGS_FILE = join(process.cwd(), "data", "admin-settings.json");

export async function POST(request: NextRequest) {
  try {
    // Load Twilio settings
    const settingsData = await readFile(SETTINGS_FILE, "utf8");
    const settings = JSON.parse(settingsData);
    
    if (!settings.twilioAccountSid || !settings.twilioAuthToken || !settings.twilioPhoneNumber) {
      return NextResponse.json(
        { error: "Twilio settings not configured" },
        { status: 400 }
      );
    }

    // Parse request body
    const { to, body, mediaUrl } = await request.json();
    
    if (!to || !body) {
      return NextResponse.json(
        { error: "Recipient and message body are required" },
        { status: 400 }
      );
    }

    // Initialize Twilio client
    const client = twilio(settings.twilioAccountSid, settings.twilioAuthToken);

    // Send message
    const message = await client.messages.create({
      body: body,
      from: settings.twilioPhoneNumber,
      to: to,
      mediaUrl: mediaUrl || undefined
    });

    return NextResponse.json({
      success: true,
      messageId: message.sid,
      status: message.status
    });

  } catch (error) {
    console.error("Error sending Twilio message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
