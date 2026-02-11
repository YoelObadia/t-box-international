'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useRouter, usePathname } from 'next/navigation';
import MobileMenu from './MobileMenu';

type Lang = 'fr' | 'en' | 'es' | 'ar';

interface HeaderProps {
    lang: Lang;
}

const langLabels: Record<Lang, { flag: string; label: string }> = {
    fr: { flag: 'flag-icon-fr', label: 'FR' },
    en: { flag: 'flag-icon-us', label: 'EN' },
    es: { flag: 'flag-icon-es', label: 'ES' },
    ar: { flag: 'flag-icon-sa', label: 'AR' },
};

export default function Header({ lang }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();

    const t = translations[lang].nav;
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        setMobileOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navItems = [
        { label: t.about, id: 'about' },
        { label: t.technology, id: 'technology' },
        { label: t.markets, id: 'markets' },
        { label: t.sustainability, id: 'sustainability' },
        { label: t.contact, id: 'contact' },
    ];

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${scrolled
                ? 'py-2 bg-[rgba(10,14,26,0.95)] backdrop-blur-xl shadow-lg shadow-black/20'
                : 'py-4 bg-gradient-to-b from-black/60 to-transparent'
                }`}
        >
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
                {/* Logo */}
                <motion.a
                    href="#hero"
                    onClick={(e) => handleScroll(e, 'hero')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3"
                >
                    <img
                        src="/images/logo.jpg"
                        alt="T-Box"
                        className={`rounded-lg object-contain transition-all duration-500 ${scrolled ? 'w-10 h-10' : 'w-12 h-12'}`}
                    />
                    <span className="text-xl font-bold text-white tracking-tight hidden sm:block" style={{ fontFamily: 'var(--font-outfit)' }}>
                        T-Box
                    </span>
                </motion.a>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => handleScroll(e, item.id)}
                            className="nav-link"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Right side: Lang + Mobile toggle */}
                <div className="flex items-center gap-3">
                    {/* Language selector */}
                    <div className="relative">
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full glass cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <span className={`flag-icon ${langLabels[lang].flag}`} />
                            <span className="text-sm text-white/80">{langLabels[lang].label}</span>
                            <svg className={`w-3 h-3 text-white/50 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <AnimatePresence>
                            {langOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full right-0 mt-2 glass rounded-xl overflow-hidden min-w-[120px]"
                                >
                                    {(Object.keys(langLabels) as Lang[]).map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => {
                                                const newPath = `/${l}${pathname.substring(3)}`; // Replace first segment
                                                router.push(newPath);
                                                setLangOpen(false);
                                            }}
                                            className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors cursor-pointer ${l === lang ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <span className={`flag-icon ${langLabels[l].flag}`} />
                                            {langLabels[l].label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Menu"
                    >
                        {mobileOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <MobileMenu
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                navItems={navItems}
            />
        </motion.header>
    );
}
