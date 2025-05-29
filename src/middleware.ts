// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

export function middleware() {
    // const path = request.nextUrl.pathname

    // const isPublicPath = path === '/login' || path === '/signup'

    // const token = request.cookies.get('token')?.value || '';

    // // console.log({
    // //     path,
    // //     isPublicPath,
    // //     token: token || "No token",
    // //     cookies: request.cookies.getAll(),
    // //     url: request.url,
    // //     headers: Object.fromEntries(request.headers.entries()),
    // // });

    // if (isPublicPath && token) {
    //     console.log("redirecting to home");
    //     return NextResponse.redirect(new URL('/', request.url))
    // }

    // if (!isPublicPath && !token) {
    //     console.log("redirecting to login");
    //     return NextResponse.redirect(new URL('/login', request.url))
    // }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
} 