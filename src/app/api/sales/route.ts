import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession } from "@/lib/auth";

export async function GET() {
    const user = await getUserFromSession();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const sales = await storage.getSales();
        return NextResponse.json(sales);
    } catch (error) {
        return new NextResponse("Failed to fetch sales", { status: 500 });
    }
}

function generateSaleNumber(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SL-${dateStr}-${randomStr}`;
}

export async function POST(req: Request) {
    const user = await getUserFromSession();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { items, customerName, customerPhone, discount } = await req.json();

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ message: "Cart items required" }, { status: 400 });
        }

        let subtotal = 0;
        for (const item of items) {
            subtotal += item.unitPrice * item.quantity;
        }

        const discountAmount = discount || 0;
        const total = subtotal - discountAmount;

        const sale = await storage.createSale({
            saleNumber: generateSaleNumber(),
            staffUserId: user.id,
            customerName: customerName || null,
            customerPhone: customerPhone || null,
            subtotal: subtotal.toString(),
            tax: "0",
            discount: discountAmount.toString(),
            total: total.toString(),
            status: "completed",
            notes: null,
        });

        for (const item of items) {
            await storage.createSaleItem({
                saleId: sale.id,
                productId: item.productId || null,
                serviceId: item.serviceId || null,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice.toString(),
                total: (item.unitPrice * item.quantity).toString(),
            });

            if (item.productId) {
                const product = await storage.getProduct(item.productId);
                if (product) {
                    await storage.updateProduct(item.productId, {
                        stockQuantity: Math.max(0, product.stockQuantity - item.quantity),
                    });
                }
            }
        }

        return NextResponse.json(sale, { status: 201 });
    } catch (error) {
        console.error("Error creating sale:", error);
        return new NextResponse("Failed to create sale", { status: 500 });
    }
}
