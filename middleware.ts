import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['fr', 'en', 'es', 'ar'] as const;
const DEFAULT_LOCALE = 'en';
const COOKIE_NAME = 'locale';

function getBestLocale(acceptLanguage: string | null): string {
    if (!acceptLanguage) return DEFAULT_LOCALE;

    const languages = acceptLanguage
        .split(',')
        .map((part) => {
            const [lang, quality] = part.trim().split(';q=');
            return {
                lang: lang.trim().toLowerCase(),
                q: quality ? parseFloat(quality) : 1.0,
            };
        })
        .sort((a, b) => b.q - a.q);

    for (const { lang } of languages) {
        const exact = SUPPORTED_LOCALES.find((l) => l === lang);
        if (exact) return exact;

        const prefix = lang.split('-')[0];
        const match = SUPPORTED_LOCALES.find((l) => l === prefix);
        if (match) return match;
    }

    return DEFAULT_LOCALE;
}

function getLocale(request: NextRequest): string {
    // 1. Check cookie (user's previous choice)
    const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
    if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as typeof SUPPORTED_LOCALES[number])) {
        return cookieLocale;
    }

    // 2. Detect from Accept-Language header
    return getBestLocale(request.headers.get('accept-language'));
}

export function middleware(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;

        // Check if the pathname already starts with a supported locale
        const pathnameHasLocale = SUPPORTED_LOCALES.some(
            (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
        );

        if (pathnameHasLocale) {
            // Extract locale from path and set cookie
            const locale = pathname.split('/')[1];
            const response = NextResponse.next();
            response.cookies.set(COOKIE_NAME, locale, {
                path: '/',
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax',
            });
            return response;
        }

        // Redirect to locale-prefixed URL
        const locale = getLocale(request);
        const url = new URL(request.url);
        url.pathname = `/${locale}${pathname}`;

        console.log(`Middleware: Redirecting ${pathname} to ${url.pathname}`);

        const response = NextResponse.redirect(url);
        response.cookies.set(COOKIE_NAME, locale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
        });
        return response;
    } catch (error) {
        console.error('MIDDLEWARE_ERROR:', error);
        // Fallback to Next() to avoid blocking the user if middleware fails
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|favicon.png|apple-icon.png|logo.jpg).*)'],
};
