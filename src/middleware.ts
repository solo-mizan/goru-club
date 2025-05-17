import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'bn'];

// Get the preferred locale, similar to above or using a library
function getLocale(request: NextRequest) {
    const acceptLanguage = request.headers.get('accept-language') ?? '';

    // Check for locale in accept-language header
    for (const locale of locales) {
        if (acceptLanguage.includes(locale)) {
            return locale;
        }
    }

    // Default to English
    return 'en';
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the pathname already has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return NextResponse.next();

    // Redirect if no locale is found
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;

    return NextResponse.redirect(request.nextUrl);
}

// Configure matcher to exclude API routes, static files, etc.
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. /api (API routes)
         * 2. /_next (Next.js internals)
         * 3. /(.*) all files in the public folder
         */
        '/((?!api|_next|.*\\..*).*)',
    ],
}; 