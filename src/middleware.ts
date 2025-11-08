import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const publicPaths = ["/login", "/api/set-cookie"];
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get("session");

    if (pathname === "/login" && sessionCookie) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const sessionData = JSON.parse(sessionCookie.value);
        if (!sessionData.isln || !sessionData.usrn) {
            throw new Error("Invalid session");
        }
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/((?!_next|static|favicon.ico).*)"],
};
