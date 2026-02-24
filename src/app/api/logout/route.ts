import { NextResponse } from "next/server";
import { clearCookieAuth } from "@/lib/auth";

export async function POST() {
    await clearCookieAuth();
    return new NextResponse(null, { status: 200 });
}
