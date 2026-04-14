import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/invoices`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy /api/invoices error:", err);
    return NextResponse.json(
      { invoices: [], error: "Failed to reach backend" },
      { status: 500 }
    );
  }
}
