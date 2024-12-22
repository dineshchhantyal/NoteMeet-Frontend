import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function  middleware(request: NextRequest) {
    // Get the auth token from the cookies
    const session =  await auth();

    // If there's no token and the user is trying to access protected routes
    if (!session && request.nextUrl.pathname != '/') {
        // Redirect to the home page

        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

// Configure which routes to run the middleware on
export const config = {
    matcher: [
        // Add your protected routes here
        '/dashboard/:path*',
        '/profile/:path*',
        // Skip authentication check for public routes
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}