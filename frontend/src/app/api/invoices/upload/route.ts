import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const res = await fetch(`${BACKEND_URL}/api/invoices/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy /api/invoices/upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload to backend" },
      { status: 500 }
    );
  }
}
