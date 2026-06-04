import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (token && // if token present and user try to fetch this routes redirect to dashboard
        (
            url.pathname.startsWith("/sign-in") ||
            url.pathname.startsWith("/sign-up")
        )
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // // return NextResponse.next();
    // return NextResponse.redirect(new URL("/", request.url));
    

    if ( /// no token and user in /dashboard redirect to sign-in 
        !token &&
        url.pathname.startsWith("/dashboard")
    ) {
        return NextResponse.redirect(
            new URL("/sign-in", request.url)
        );
    }

    return NextResponse.next();
}

export const config = { // Middleware is check before this routes 
    matcher: [
        "/sign-in",
        "/sign-up",
        "/verify",
        "/dashboard/:path*",
    ],
};