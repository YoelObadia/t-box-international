import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import the configuration
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Constante pour les bots fréquents (évite d'allouer une regex à chaque requête)
// Cela permet de ne pas gaspiller de temps de calcul (CPU) pour les robots d'indexation
const BOT_AGENTS = /bot|crawler|spider|crawling|googlebot|bingbot|yandexbot|slurp|duckduckbot/i;

function getLocale(request: NextRequest): string {
    // 1. FAST-PATH : Si c'est un bot, on renvoie la langue par défaut immédiatement
    // Cela évite de charger Negotiator et matchLocale qui sont lourds en CPU
    const userAgent = request.headers.get('user-agent') || '';
    if (BOT_AGENTS.test(userAgent)) {
        return i18n.defaultLocale;
    }

    // 2. Traitement standard pour les vrais utilisateurs
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // @ts-expect-error locales are readonly
    const locales: string[] = i18n.locales;

    // Use negotiator and intl-localematcher to get best locale
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
        locales
    );

    return matchLocale(languages, locales, i18n.defaultLocale);
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // FAST-PATH : Bloquer les assets qui auraient pu échapper au matcher
    // Évite l'exécution de code lourd pour des fichiers statiques
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale: string) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);

        // e.g. incoming request is /products -> /fr/products
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
                request.url
            )
        );
    }

    return NextResponse.next();
}

export const config = {
    // Matcher hautement optimisé (exécuté en Rust par Vercel, 0 CPU Middleware)
    // Ignore _next, api, et toutes les extensions de fichiers courantes (images, fonts, etc.)
    matcher: [
        '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:html?|css|js(?:on)?|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm)).*)',
    ],
};
