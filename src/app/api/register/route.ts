import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { hashedPassword, setCookieAuth } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const existingUser = await storage.getUserByUsername(body.username);

        if (existingUser) {
            return new NextResponse("Username already exists", { status: 400 });
        }

        const hash = await hashedPassword(body.password);
        const users = await storage.getUsers();
        const isFirstUser = users.length === 0;

        const user = await storage.createUser({
            ...body,
            password: hash,
            role: isFirstUser ? "admin" : "sales",
        });

        const { password, ...safeUser } = user;

        await setCookieAuth(safeUser);

        return NextResponse.json(safeUser, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
