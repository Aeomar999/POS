import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth";

export async function GET() {
    try {
        const user = await getUserFromSession();

        if (!user) {
            return new NextResponse("Not authenticated", { status: 401 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return new NextResponse("Internal server error", { status: 500 });
    }
}
