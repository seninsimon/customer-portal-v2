import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_FRONTEND_URL;

export async function POST(request: Request) {
    const origin = request.headers.get("origin");
    const cookiesStore = await cookies();

    if (origin !== ALLOWED_ORIGIN) {
        return NextResponse.json({ error: "Forbidden", origin }, { status: 403 });
    }

    const { isln, usrn } = await request.json();

    if (isln && usrn) {
        const sessionData = { isln, usrn };
        cookiesStore.set("session", JSON.stringify(sessionData), { path: "/", httpOnly: true });
    } else {
        return NextResponse.json({ error: "Invalid session data" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}
