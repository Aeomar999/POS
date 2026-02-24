import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession } from "@/lib/auth";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromSession();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        const product = await storage.getProduct(id);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        return new NextResponse("Failed to fetch product", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromSession();
    if (!user || !["admin", "manager"].includes(user.role)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        const updateData = insertProductSchema.partial().parse(await req.json());
        const product = await storage.updateProduct(id, updateData);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        return new NextResponse("Failed to update product", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromSession();
    if (!user || !["admin", "manager"].includes(user.role)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        await storage.deleteProduct(id);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Failed to delete product", { status: 500 });
    }
}
