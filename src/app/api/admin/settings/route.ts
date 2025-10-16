import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const SETTINGS_FILE = join(process.cwd(), "data", "admin-settings.json");

export async function GET() {
  try {
    const data = await readFile(SETTINGS_FILE, "utf8");
    const settings = JSON.parse(data);
    return NextResponse.json(settings);
  } catch (error) {
    // Return default settings if file doesn't exist
    const defaultSettings = {
      twilioAccountSid: "",
      twilioAuthToken: "",
      twilioPhoneNumber: "",
      webhookUrl: ""
    };
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();
    
    // Save to file (no validation required - allow partial settings)
    await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
