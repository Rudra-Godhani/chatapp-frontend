// pages/_middleware.ts or middleware.ts (depending on your Next.js version)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    console.log("----------middleware is running (PROD DEBUG)-------------")
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/login' || path === '/signup'

    // Log the entire raw Cookie header
    const rawCookieHeader = request.headers.get('cookie');
    console.log("Raw Cookie Header in Middleware: ", rawCookieHeader);

    // Attempt to get the token, and log the outcome
    const token = request.cookies.get('token')?.value || '';
    console.log("Token from request.cookies.get('token'): ", token);

    // Log all cookies the middleware sees (might be empty if 'token' isn't parsed)
    console.log("All Cookies seen by Middleware: ", request.cookies.getAll());

    console.log({
        path,
        isPublicPath,
        token: token || "No token (After parsing)",
        url: request.url,
        // Be careful logging sensitive headers in production. For debug, it's ok for a short time.
        headers: Object.fromEntries(request.headers.entries()),
    });

    if (isPublicPath && token) {
        console.log("PROD DEBUG: Public path with token, redirecting to home");
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!isPublicPath && !token) {
        console.log("PROD DEBUG: Private path without token, redirecting to login");
        return NextResponse.redirect(new URL('/login', request.url))
    }

    console.log("PROD DEBUG: Middleware continuing request.");
    return NextResponse.next(); // Ensure a return for non-redirect cases
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}