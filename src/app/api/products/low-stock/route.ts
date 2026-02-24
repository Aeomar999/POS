import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession } from "@/lib/auth";

export async function GET() {
    const user = await getUserFromSession();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const products = await storage.getLowStockProducts();
        return NextResponse.json(products);
    } catch (error) {
        return new NextResponse("Failed to fetch low stock products", { status: 500 });
    }
}
