import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/reviews`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, reviews: data.data || [] });
    }
    return NextResponse.json({ success: false, reviews: [], message: "Failed to fetch reviews" }, { status: res.status });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch reviews";
    return NextResponse.json({ success: false, reviews: [], error: errorMessage }, { status: 500 });
  }
}
