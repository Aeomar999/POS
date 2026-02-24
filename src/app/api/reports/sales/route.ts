import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession } from "@/lib/auth";

export async function GET(req: Request) {
    const user = await getUserFromSession();
    if (!user || !["admin", "manager"].includes(user.role)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "week";
        const report = await storage.getSalesReport(period);
        return NextResponse.json(report);
    } catch (error) {
        return new NextResponse("Failed to fetch sales report", { status: 500 });
    }
}
