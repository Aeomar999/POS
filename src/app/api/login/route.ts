import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { comparePasswords, setCookieAuth } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
            return NextResponse.json(
                { message: "Invalid username or password" },
                { status: 401 }
            );
        }

        if (!user.isActive) {
            return NextResponse.json(
                { message: "Account is inactive" },
                { status: 403 }
            );
        }

        const { password: _, ...safeUser } = user;

        // Set the JWT cookie
        await setCookieAuth(safeUser);

        return NextResponse.json(safeUser);
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
