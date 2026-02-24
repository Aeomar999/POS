import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession } from "@/lib/auth";

export async function GET() {
    const user = await getUserFromSession();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const stats = await storage.getDashboardStats();
        return NextResponse.json(stats);
    } catch (error) {
        return new NextResponse("Failed to fetch dashboard stats", { status: 500 });
    }
}
