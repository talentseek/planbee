import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("better-auth.session_token");

    // List of protected routes
    const protectedRoutes = ["/dashboard", "/timer", "/planning", "/projects", "/settings"];
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (isProtectedRoute && !sessionCookie) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Redirect authenticated users from splash page to dashboard
    if (request.nextUrl.pathname === "/" && sessionCookie) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/timer/:path*", "/planning/:path*", "/projects/:path*", "/settings/:path*"],
};
