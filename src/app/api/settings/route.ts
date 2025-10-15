import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const dataDir = path.join(process.cwd(), "data");
const settingsPath = path.join(dataDir, "settings.json");

type Settings = {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  webhookUrl: string;
};

async function readSettings(): Promise<Settings> {
  try {
    const data = await readFile(settingsPath, "utf-8");
    return JSON.parse(data) as Settings;
  } catch {
    return {
      twilioAccountSid: "",
      twilioAuthToken: "",
      twilioPhoneNumber: "",
      webhookUrl: "",
    };
  }
}

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Settings>;
  const settings = { ...(await readSettings()), ...body };
  await mkdir(dataDir, { recursive: true });
  await writeFile(settingsPath, JSON.stringify(settings, null, 2), "utf-8");
  return NextResponse.json({ success: true, settings });
}