import { MetadataRoute } from 'next';

const baseUrl = 'https://www.t-box-international.com';
const languages = ['fr', 'en', 'es', 'ar'];

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = languages.map((lang) => ({
        url: `${baseUrl}/${lang}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
    }));

    // Add root URL as well (which redirects to /en or detected lang)
    // Actually, sitemaps should list canonical URLs. The root redirects, so maybe better to list localized versions.
    // Google suggests listing all localized versions.

    return routes;
}
