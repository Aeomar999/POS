import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession, hashedPassword } from "@/lib/auth";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromSession();
    if (!user || user.role !== "admin") return new NextResponse("Unauthorized", { status: 401 });

    try {
        const updateData = insertUserSchema.partial().parse(await req.json());

        if (updateData.password) {
            updateData.password = await hashedPassword(updateData.password);
        }

        const { id } = await params;
        const staff = await storage.updateUser(id, updateData);
        if (!staff) {
            return NextResponse.json({ message: "Staff not found" }, { status: 404 });
        }

        const { password, ...safeStaff } = staff;
        return NextResponse.json(safeStaff);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        return new NextResponse("Failed to update staff", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromSession();
    if (!user || user.role !== "admin") return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        await storage.deleteUser(id);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Failed to delete staff", { status: 500 });
    }
}
