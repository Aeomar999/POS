import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { User } from "@shared/schema";
import { storage } from "./storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// --- JWT Setup ---
const secretKey = process.env.SESSION_SECRET || "fallback_secret_key_for_development";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

// --- Cookie Auth ---
export async function setCookieAuth(user: Omit<User, "password">) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ user, expires });

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}

export async function clearCookieAuth() {
    const cookieStore = await cookies();
    cookieStore.set("session", "", {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function getUserFromSession(): Promise<Omit<User, "password"> | null> {
    const session = await getSession();
    if (!session || !session.user) return null;

    try {
        const freshUser = await storage.getUser(session.user.id);
        if (!freshUser || !freshUser.isActive) return null;
        const { password, ...userWithoutPassword } = freshUser;
        return userWithoutPassword;
    } catch (err) {
        return null;
    }
}

// --- Password Hashing Setup ---
const scryptAsync = promisify(scrypt);

export async function hashedPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
}
