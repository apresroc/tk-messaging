import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

const DATA_DIR = join(process.cwd(), "data");
const USER_SETTINGS_FILE = join(DATA_DIR, "user-settings.json");

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const data = await readFile(USER_SETTINGS_FILE, "utf8").catch(() => "{}");
    const allSettings = JSON.parse(data);
    const userSettings = allSettings[userId] || getDefaultSettings();

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error("Error loading user settings:", error);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, settings } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const data = await readFile(USER_SETTINGS_FILE, "utf8").catch(() => "{}");
    const allSettings = JSON.parse(data);
    
    allSettings[userId] = settings;
    
    await writeFile(USER_SETTINGS_FILE, JSON.stringify(allSettings, null, 2));
    
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error saving user settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

function getDefaultSettings() {
  return {
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    sounds: {
      message: true,
      notification: true,
      volume: 80,
      messageSound: 'default',
      notificationSound: 'chime',
    },
    theme: {
      mode: 'light',
    },
    privacy: {
      readReceipts: true,
      typingIndicators: true,
    },
    profile: {
      name: '',
      email: '',
      phone: '',
      username: '',
    },
  };
}
