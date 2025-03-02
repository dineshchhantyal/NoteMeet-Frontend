import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	// Get the auth token from the cookies
	const session = await auth();

	// If there's no token and the user is trying to access protected routes
	if (!session && request.nextUrl.pathname !== '/') {
		// Build the URL with previous path and a showAuthMessage flag
		const redirectUrl = new URL(
			`/?prev=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}&showAuthMessage=true`,
			request.nextUrl.origin,
		);

		return NextResponse.redirect(redirectUrl);
	}

	return NextResponse.next();
}

// Configure which routes to run the middleware on
export const config = {
	matcher: [
		// Add your protected routes here
		'/dashboard/:path*',
		'/profile/:path*',
		'/invitation/:path*',
		// Skip authentication check for public routes
		// '/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
