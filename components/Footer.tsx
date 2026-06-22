/* eslint-disable @next/next/no-img-element */
'use client';

import { translations } from '@/lib/translations';
import ContactForm from './ContactForm';
import AnimatedSection from './AnimatedSection';
import { motion } from 'framer-motion';

type Lang = 'fr' | 'en' | 'es' | 'ar';

interface FooterProps {
    lang: Lang;
}

const socialLinks = [
    { href: 'https://www.facebook.com/tboxchef?mibextid=LQQJ4d', icon: 'fab fa-facebook-f', label: 'Facebook' },
    { href: 'https://tbox-chef.com/', icon: 'fas fa-globe', label: 'Website' },
];

export default function Footer({ lang }: FooterProps) {
    const t = translations[lang];
    const isRtl = lang === 'ar';

    const navItems = [
        { label: t.nav.about, id: 'about' },
        { label: t.nav.technology, id: 'technology' },
        { label: t.nav.markets, id: 'markets' },
        { label: t.nav.sustainability, id: 'sustainability' },
        { label: t.nav.contact, id: 'contact' },
    ];

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer
            id="contact"
            className="relative w-full mt-20 overflow-hidden"
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
            {/* Top gradient border */}
            <div className="h-[2px] bg-linear-to-r from-transparent via-blue-500 to-transparent" />

            {/* Background */}
            <div className="absolute inset-0 bg-(--bg-secondary)" />
            <div className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }}
            />

            <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
                <AnimatedSection>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold heading-gradient mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
                            {t.contact.title}
                        </h2>
                        <p className="text-(--text-secondary) text-lg">{t.contact.desc}</p>
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Contact Form (Left - wider) */}
                    <div className="lg:col-span-7">
                        <AnimatedSection variant="fade-left">
                            <ContactForm lang={lang} />
                        </AnimatedSection>
                    </div>

                    {/* Info column (Right) */}
                    <div className="lg:col-span-5 space-y-8">
                        <AnimatedSection variant="fade-right" delay={0.2}>
                            <div className="space-y-8">
                                {/* Navigation Links */}
                                <div className="glass p-6 rounded-2xl">
                                    <h3 className="text-lg font-bold text-white mb-4">Navigation</h3>
                                    <nav className="flex flex-col gap-3">
                                        {navItems.map((item) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                onClick={(e) => handleScroll(e, item.id)}
                                                className="text-(--text-secondary) hover:text-white transition-colors flex items-center gap-2 group"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                {item.label}
                                            </a>
                                        ))}
                                    </nav>
                                </div>

                                {/* Address */}
                                <div className="glass p-6 rounded-2xl">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="text-2xl">📍</span>
                                        {t.contact.address.title}
                                    </h3>
                                    <div className="space-y-1.5">
                                        {t.contact.address.lines.map((line, i) => (
                                            <p key={i} className="text-(--text-secondary)">{line}</p>
                                        ))}
                                    </div>
                                </div>

                                {/* Social */}
                                <div className="glass p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-white mb-4">{t.contact.follow}</h3>
                                    <div className="flex gap-3">
                                        {socialLinks.map((social, i) => (
                                            <motion.a
                                                key={i}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.15, y: -3 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-12 h-12 rounded-xl glass flex items-center justify-center text-(--text-secondary) hover:text-white hover:border-blue-500/30 transition-colors"
                                                aria-label={social.label}
                                            >
                                                <i className={`${social.icon} text-lg`} />
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo.jpg" alt="T-Box" className="w-8 h-8 rounded-md object-contain" />
                        <span className="text-sm text-(--text-muted)">
                            © {new Date().getFullYear()} T-Box International
                        </span>
                    </div>
                    <p className="text-xs text-(--text-muted)">
                        LUSFLEY COMPANY S.A. — Montevideo, Uruguay
                    </p>
                </div>
            </div>
        </footer>
    );
}
