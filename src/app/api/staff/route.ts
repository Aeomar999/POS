import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getUserFromSession, hashedPassword } from "@/lib/auth";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function GET() {
    const user = await getUserFromSession();
    if (!user || user.role !== "admin") return new NextResponse("Unauthorized", { status: 401 });

    try {
        const staff = await storage.getUsers();
        const safeStaff = staff.map(({ password, ...rest }) => rest);
        return NextResponse.json(safeStaff);
    } catch (error) {
        return new NextResponse("Failed to fetch staff", { status: 500 });
    }
}

export async function POST(req: Request) {
    const user = await getUserFromSession();
    if (!user || user.role !== "admin") return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = insertUserSchema.parse(await req.json());
        const hash = await hashedPassword(data.password);

        const staff = await storage.createUser({
            ...data,
            password: hash,
        });

        const { password, ...safeStaff } = staff;
        return NextResponse.json(safeStaff, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        return new NextResponse("Failed to create staff", { status: 500 });
    }
}
