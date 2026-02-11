'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import { translations } from '@/lib/translations';

gsap.registerPlugin(ScrollTrigger);

type Lang = 'fr' | 'en' | 'es' | 'ar';

const marketIcons = ['🏨', '✈️', '🎖️', '🤝', '🏥', '🛒', '🚄', '⛺', '⚽', '🌍', '🎓', '🏢'];

export default function Home() {
    const params = useParams();
    const lang = (params.lang as Lang) || 'en';
    const t = translations[lang];
    const isRtl = lang === 'ar';

    const heroRef = useRef<HTMLDivElement>(null);

    // GSAP parallax for hero background
    useEffect(() => {
        if (!heroRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to('.hero-bg-gradient', {
                backgroundPosition: '100% 100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <main className="flex flex-col items-center min-h-screen" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <Header lang={lang} />

            {/* ═══ Hero Section ═══ */}
            <section
                id="hero"
                ref={heroRef}
                className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
                style={{ maxWidth: '100%', padding: '6rem 1rem 4rem' }}
            >
                {/* Animated gradient background */}
                <div className="hero-bg-gradient absolute inset-0 animated-gradient" />

                {/* Grid dots overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Glow orbs */}
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]" />

                <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 glass text-blue-300">
                            🔥 Self-Heating Technology
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        <span className="heading-gradient">{t.hero.title}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="text-lg md:text-xl text-[var(--text-secondary)] max-w-[700px] mx-auto mb-10 leading-relaxed"
                    >
                        {t.hero.desc}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex items-center justify-center gap-4 mb-12"
                    >
                        <a
                            href="#about"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="btn-primary"
                        >
                            {lang === 'fr' ? 'Découvrir' : lang === 'es' ? 'Descubrir' : lang === 'ar' ? 'اكتشف' : 'Discover'}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="relative max-w-3xl mx-auto"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
                        <video
                            src="/images/demo.mp4"
                            controls
                            className="relative w-full rounded-2xl shadow-2xl shadow-black/40 border border-white/10"
                        />
                    </motion.div>
                </div>
            </section>

            {/* ═══ About Section ═══ */}
            <section id="about">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <AnimatedSection variant="fade-left" className="flex-1">
                        <h2>{t.about.title}</h2>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                            {t.about.desc}
                        </p>
                    </AnimatedSection>

                    <AnimatedSection variant="fade-right" delay={0.2} className="flex-1">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-2xl blur-2xl" />
                            <img
                                src="/images/about-us.jpg"
                                alt="T-Box"
                                className="relative w-full rounded-2xl shadow-2xl shadow-black/30 border border-white/5"
                            />
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ═══ Technology Section ═══ */}
            <section id="technology">
                <AnimatedSection>
                    <h2 className="text-center">{t.technology.title}</h2>
                    <p className="text-lg text-[var(--text-secondary)] text-center max-w-[800px] mx-auto mb-12">
                        {t.technology.desc}
                    </p>
                </AnimatedSection>

                {/* Key stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {t.technology.list.map((item, idx) => (
                        <AnimatedSection key={idx} delay={idx * 0.15} variant="scale-in">
                            <GlassCard className="text-center h-full">
                                <div className="text-4xl font-bold heading-gradient mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    {idx === 0 && <AnimatedCounter target={2} suffix={lang === 'fr' ? ' ans' : lang === 'es' ? ' años' : lang === 'ar' ? ' سنة' : ' yrs'} />}
                                    {idx === 1 && <AnimatedCounter target={5} suffix=" min" prefix="2-" />}
                                    {idx === 2 && <>♻️</>}
                                </div>
                                <p className="text-[var(--text-secondary)]">{item}</p>
                            </GlassCard>
                        </AnimatedSection>
                    ))}
                </div>

                {/* Steps */}
                <AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            /* Step 1 — Press the button */
                            <svg key="s1" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-24 h-24 mx-auto text-blue-400/80">
                                <rect x="25" y="20" width="50" height="65" rx="6" />
                                <circle cx="75" cy="52" r="6" fill="currentColor" opacity="0.6" />
                                <path d="M90 48 C 85 42, 82 46, 81 48" strokeWidth="2.5" />
                                <path d="M93 42 C 88 36, 84 40, 83 43" strokeWidth="2" opacity="0.5" />
                                <line x1="35" y1="32" x2="60" y2="32" strokeWidth="1.5" opacity="0.3" />
                                <line x1="35" y1="38" x2="55" y2="38" strokeWidth="1.5" opacity="0.3" />
                            </svg>,
                            /* Step 2 — Let it heat */
                            <svg key="s2" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-24 h-24 mx-auto text-orange-400/80">
                                <rect x="25" y="35" width="50" height="45" rx="6" />
                                <path d="M40 30 Q 42 20, 40 12" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M50 28 Q 52 18, 50 10" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M60 30 Q 62 20, 60 12" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="50" cy="57" r="10" strokeWidth="1.5" opacity="0.4" />
                                <path d="M50 50 Q 53 54, 50 60 Q 47 54, 50 50" fill="currentColor" opacity="0.3" />
                            </svg>,
                            /* Step 3 — Open and eat */
                            <svg key="s3" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-24 h-24 mx-auto text-green-400/80">
                                <rect x="25" y="40" width="50" height="40" rx="6" />
                                <path d="M25 40 L 35 18 L 65 18 L 75 40" strokeWidth="2" />
                                <line x1="35" y1="18" x2="65" y2="18" strokeWidth="2" opacity="0.4" strokeDasharray="4 3" />
                                <circle cx="42" cy="55" r="4" fill="currentColor" opacity="0.25" />
                                <circle cx="55" cy="52" r="5" fill="currentColor" opacity="0.25" />
                                <circle cx="48" cy="63" r="3" fill="currentColor" opacity="0.2" />
                            </svg>,
                        ].map((icon, idx) => (
                            <AnimatedSection key={idx} delay={idx * 0.2} variant="fade-up">
                                <GlassCard className="text-center">
                                    <div className="mb-3">
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold"
                                            style={{ background: 'var(--accent-gradient)', color: 'white' }}>
                                            {idx + 1}
                                        </span>
                                    </div>
                                    <div className="mb-4">{icon}</div>
                                    <p className="text-[var(--text-secondary)] text-sm">{t.technology.steps[idx]}</p>
                                </GlassCard>
                            </AnimatedSection>
                        ))}
                    </div>
                </AnimatedSection>

                <AnimatedSection delay={0.3} className="mt-12">
                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute -inset-3 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 rounded-2xl blur-xl" />
                        <img
                            src="/images/technology.jpg"
                            alt="Technology"
                            className="relative w-full rounded-2xl shadow-xl border border-white/5"
                        />
                    </div>
                </AnimatedSection>
            </section>

            {/* ═══ Markets Section ═══ */}
            <section id="markets">
                <AnimatedSection>
                    <h2 className="text-center">{t.markets.title}</h2>
                    <p className="text-lg text-[var(--text-secondary)] text-center max-w-[800px] mx-auto mb-12">
                        {t.markets.desc}
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {t.markets.list.map((market, idx) => (
                        <AnimatedSection key={idx} delay={idx * 0.08} variant="scale-in">
                            <GlassCard className="flex items-start gap-4 h-full">
                                <span className="market-icon">{marketIcons[idx]}</span>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">{market.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">{market.desc}</p>
                                </div>
                            </GlassCard>
                        </AnimatedSection>
                    ))}
                </div>

                <AnimatedSection delay={0.3} className="mt-12">
                    <div className="relative max-w-3xl mx-auto">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/15 to-cyan-500/10 rounded-2xl blur-xl" />
                        <video
                            src="/images/market.mp4"
                            controls
                            className="relative w-full rounded-2xl shadow-2xl shadow-black/40 border border-white/10"
                        />
                    </div>
                </AnimatedSection>
            </section>

            {/* ═══ Sustainability Section ═══ */}
            <section id="sustainability" className="relative overflow-hidden" style={{ padding: 0, maxWidth: '100%' }}>
                <div className="relative min-h-[500px] flex items-center">
                    {/* Background image with overlay */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/sustainability.jpg"
                            alt="Sustainability"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/95 via-[var(--bg-primary)]/80 to-[var(--bg-primary)]/60" />
                    </div>

                    <div className="relative z-10 w-full mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
                        <AnimatedSection variant="fade-left">
                            <div className="max-w-[600px]">
                                <motion.div
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <span className="text-2xl">🌱</span>
                                    <span className="text-green-400 text-sm font-medium">Eco-Friendly</span>
                                </motion.div>

                                <h2>{t.sustainability.title}</h2>
                                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                                    {t.sustainability.desc}
                                </p>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* ═══ Co-Founders Section ═══ */}
            <section id="co-founders" className="pb-0">
                <AnimatedSection>
                    <div className="max-w-4xl mx-auto">
                        <GlassCard className="text-center relative overflow-hidden" hover={false}>
                            {/* Subtle gradient accent */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

                            <div className="pt-4">
                                <motion.div
                                    className="relative inline-block mb-6"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-md" />
                                    <img
                                        src="/images/michel-cohen.jpg"
                                        alt="Michel Cohen"
                                        className="relative w-[130px] h-[130px] rounded-full object-cover border-2 border-white/10 pulse-ring"
                                    />
                                </motion.div>

                                <h3 className="text-2xl font-bold heading-gradient mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    {t.founders.name}
                                </h3>

                                <p className="text-[var(--text-secondary)] mb-6 max-w-[500px] mx-auto">
                                    {t.founders.desc}
                                </p>

                                <div className={`text-left space-y-3 ${isRtl ? 'text-right' : ''}`}>
                                    {t.founders.list.map((item, idx) => (
                                        <AnimatedSection key={idx} delay={idx * 0.1} variant="fade-up">
                                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                                <span
                                                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                                                    style={{ background: 'var(--accent-gradient)', color: 'white' }}
                                                >
                                                    {idx + 1}
                                                </span>
                                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item}</p>
                                            </div>
                                        </AnimatedSection>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </AnimatedSection>
            </section>

            <Footer lang={lang} />
        </main >
    );
}
