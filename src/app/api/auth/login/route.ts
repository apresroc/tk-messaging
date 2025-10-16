import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const CUSTOMERS_FILE = join(process.cwd(), "data", "customers.json");

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Read customers from file
    const customersData = await readFile(CUSTOMERS_FILE, "utf8").catch(() => "[]");
    const customers = JSON.parse(customersData);

    // Find customer by username/email and password
    const customer = customers.find(
      (c: any) => (c.username === username || c.email === username) && c.password === password
    );

    if (!customer) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Return customer data (without password)
    const { password: _, ...customerWithoutPassword } = customer;
    return NextResponse.json({
      success: true,
      customer: customerWithoutPassword,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
