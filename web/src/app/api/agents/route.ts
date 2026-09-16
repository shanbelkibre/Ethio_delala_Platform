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
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch agents";
    return NextResponse.json({ success: false, agents: [], error: errorMessage }, { status: 500 });
  }
}
