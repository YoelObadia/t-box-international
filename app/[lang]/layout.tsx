import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import '../globals.css';
import { translations } from '@/lib/translations';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['400', '500', '600', '700', '800'] });

type Lang = 'fr' | 'en' | 'es' | 'ar';

export async function generateStaticParams() {
    return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'es' }, { lang: 'ar' }];
}

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const params = await props.params;
    const lang = (params.lang as Lang) || 'en';
    const t = translations[lang]?.seo || translations['en'].seo;
    const baseUrl = 'https://www.t-box-international.com';

    return {
        title: `T-Box International — ${t.title}`,
        description: t.desc,
        keywords: t.keywords,
        icons: {
            icon: '/images/favicon.ico',
        },
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: `/${lang}`,
            languages: {
                'fr': '/fr',
                'en': '/en',
                'es': '/es',
                'ar': '/ar',
                'x-default': '/en',
            },
        },
        openGraph: {
            title: `T-Box International — ${t.title}`,
            description: t.desc,
            url: `/${lang}`,
            siteName: 'T-Box International',
            images: [
                {
                    url: '/images/logo.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'T-Box International Logo',
                },
            ],
            locale: lang,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `T-Box International — ${t.title}`,
            description: t.desc,
            images: ['/images/logo.jpg'],
        },
    };
}

export default async function RootLayout(props: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const params = await props.params;
    const { lang } = params;
    const { children } = props;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
        <html lang={lang} dir={dir} className={`${inter.variable} ${outfit.variable}`}>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css" />
            </head>
            <body className={`${inter.className} antialiased`}>{children}</body>
        </html>
    );
}
