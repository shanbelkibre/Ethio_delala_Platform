import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/stats`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, stats: data.data || null });
    }
    return NextResponse.json({ success: false, stats: null, message: "Failed to fetch stats" }, { status: res.status });
  } catch (err: any) {
    console.error("Backend stats API error:", err);
    return NextResponse.json({ success: false, stats: null, error: err.message }, { status: 500 });
  }
}
