import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession } from "@/lib/auth";
import { z } from "zod";
import { userSettingsSchema } from "@shared/schema";

const updateSettingsSchema = userSettingsSchema.pick({
    theme: true,
    emailNotifications: true,
    pushNotifications: true,
});

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let settings = await storage.getUserSettings(user.id);

        if (!settings) {
            settings = await storage.createUserSettings(user.id);
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const json = await req.json();
        const result = updateSettingsSchema.safeParse(json);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid data", details: result.error.errors }, { status: 400 });
        }

        const settings = await storage.updateUserSettings(user.id, result.data);

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
