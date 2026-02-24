import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession } from "@/lib/auth";
import { z } from "zod";

const markReadSchema = z.object({
    id: z.string().uuid().optional(), // if not provided, marks all as read
});

export async function PATCH(req: NextRequest) {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const json = await req.json();
        const result = markReadSchema.safeParse(json);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid data", details: result.error.errors }, { status: 400 });
        }

        const { count } = await storage.markNotificationAsRead(user.id, result.data.id);
        return NextResponse.json({ success: true, count });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
