import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/agents`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, agents: data.data || [] });
    }
    return NextResponse.json({ success: false, agents: [], message: "Failed to fetch agents" }, { status: res.status });
  } catch (err: any) {
    console.error("Backend agents API error:", err);
    return NextResponse.json({ success: false, agents: [], error: err.message }, { status: 500 });
  }
}
