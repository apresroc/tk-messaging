import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const CUSTOMERS_FILE = join(process.cwd(), "data", "customers.json");

export async function GET() {
  try {
    const data = await readFile(CUSTOMERS_FILE, "utf8");
    const customers = JSON.parse(data);
    return NextResponse.json(customers);
  } catch (error) {
    // Return empty array if file doesn't exist
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const newCustomer = await request.json();
    
    // Validate required fields
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.username || !newCustomer.password) {
      return NextResponse.json(
        { error: "Name, phone number, username, and password are required" },
        { status: 400 }
      );
    }

    // Add ID and timestamp
    const customer = {
      id: `cust_${Date.now()}`,
      name: newCustomer.name,
      email: newCustomer.email || "",
      phone: newCustomer.phone,
      username: newCustomer.username,
      password: newCustomer.password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    };

    // Read existing customers
    let customers = [];
    try {
      const data = await readFile(CUSTOMERS_FILE, "utf8");
      customers = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start with empty array
    }

    // Add new customer
    customers.push(customer);

    // Save to file
    await writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
    
    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error("Error saving customer:", error);
    return NextResponse.json(
      { error: "Failed to save customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("id");

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // Read existing customers
    const data = await readFile(CUSTOMERS_FILE, "utf8");
    const customers = JSON.parse(data);

    // Remove customer
    const filteredCustomers = customers.filter((c: any) => c.id !== customerId);

    // Save to file
    await writeFile(CUSTOMERS_FILE, JSON.stringify(filteredCustomers, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
