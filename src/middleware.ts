// pages/_middleware.ts or middleware.ts (depending on your Next.js version)

export function middleware() {
    // const path = request.nextUrl.pathname

    // const isPublicPath = path === '/login' || path === '/signup'

    // const token = request.cookies.get('token')?.value || '';

    // if (isPublicPath && token) {
    //     return NextResponse.redirect(new URL('/', request.url))
    // }

    // if (!isPublicPath && !token) {
    //     return NextResponse.redirect(new URL('/login', request.url))
    // }

    // return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}