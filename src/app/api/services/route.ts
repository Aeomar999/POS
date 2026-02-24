import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession } from "@/lib/auth";
import { insertServiceSchema } from "@shared/schema";
import { z } from "zod";

export async function GET() {
    const user = await getUserFromSession();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const services = await storage.getServices();
        return NextResponse.json(services);
    } catch (error) {
        return new NextResponse("Failed to fetch services", { status: 500 });
    }
}

export async function POST(req: Request) {
    const user = await getUserFromSession();
    if (!user || !["admin", "manager"].includes(user.role)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = insertServiceSchema.parse(await req.json());
        const service = await storage.createService(data);
        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        return new NextResponse("Failed to create service", { status: 500 });
    }
}
