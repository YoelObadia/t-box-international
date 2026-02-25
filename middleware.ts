// middleware.ts
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
    const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
    if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as any)) {
        return cookieLocale;
    }
    return getBestLocale(request.headers.get('accept-language'));
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. SECURITE : On ignore tout ce qui ressemble à un fichier statique ou interne
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') || // Ignore favicon.ico, logo.png, etc.
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml'
    ) {
        return NextResponse.next();
    }

    // 2. Vérifier si la locale est déjà dans l'URL
    const pathnameHasLocale = SUPPORTED_LOCALES.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        const locale = pathname.split('/')[1];
        const response = NextResponse.next();
        // On rafraîchit le cookie pour qu'il reste valide
        response.cookies.set(COOKIE_NAME, locale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
        });
        return response;
    }

    // 3. Redirection si aucune locale n'est présente
    const locale = getLocale(request);
    const url = request.nextUrl.clone();

    // Construction propre du chemin pour éviter les doubles slashs //
    const cleanPathname = pathname === '/' ? '' : pathname;
    url.pathname = `/${locale}${cleanPathname}`;

    const response = NextResponse.redirect(url);
    response.cookies.set(COOKIE_NAME, locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
    });

    return response;
}

export const config = {
    // On affine le matcher pour exclure les assets connus
    matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|.*\\..*).*)'],
};