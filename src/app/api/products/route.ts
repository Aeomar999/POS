import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession } from "@/lib/auth";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

export async function GET() {
    const user = await getUserFromSession();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const products = await storage.getProducts();
        return NextResponse.json(products);
    } catch (error) {
        return new NextResponse("Failed to fetch products", { status: 500 });
    }
}

export async function POST(req: Request) {
    const user = await getUserFromSession();
    if (!user || !["admin", "manager"].includes(user.role)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = insertProductSchema.parse(await req.json());
        const product = await storage.createProduct(data);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        return new NextResponse("Failed to create product", { status: 500 });
    }
}
