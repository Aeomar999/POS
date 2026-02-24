import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const notifications = await storage.getNotifications(user.id);

        return NextResponse.json(notifications);
    } catch (error: any) {
        console.error("[NOTIFICATIONS GET ERROR]", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
