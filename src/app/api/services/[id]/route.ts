import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession } from "@/lib/auth";
import { insertServiceSchema } from "@shared/schema";
import { z } from "zod";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromSession();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        const service = await storage.getService(id);
        if (!service) {
            return NextResponse.json({ message: "Service not found" }, { status: 404 });
        }
        return NextResponse.json(service);
    } catch (error) {
        return new NextResponse("Failed to fetch service", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromSession();
    if (!user || !["admin", "manager"].includes(user.role)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        const updateData = insertServiceSchema.partial().parse(await req.json());
        const service = await storage.updateService(id, updateData);
        if (!service) {
            return NextResponse.json({ message: "Service not found" }, { status: 404 });
        }
        return NextResponse.json(service);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        return new NextResponse("Failed to update service", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromSession();
    if (!user || !["admin", "manager"].includes(user.role)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        await storage.deleteService(id);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Failed to delete service", { status: 500 });
    }
}
