'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
    label: string;
    id: string;
}

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navItems: NavItem[];
}

export default function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        onClose();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.nav
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden overflow-hidden bg-[rgba(10,14,26,0.95)] backdrop-blur-xl border-b border-white/5 absolute top-full left-0 right-0 shadow-2xl border-t border-white/10"
                >
                    <div className="px-6 py-6 flex flex-col gap-6 items-center text-center">
                        {navItems.map((item, i) => (
                            <motion.a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(e) => handleScroll(e, item.id)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 + 0.1 }}
                                className="text-lg font-medium text-white/90 hover:text-white hover:tracking-wide transition-all duration-300"
                            >
                                {item.label}
                            </motion.a>
                        ))}
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
