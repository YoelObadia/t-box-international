'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error';

interface ToastProps {
    message: string;
    type: ToastType;
    title?: string;
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type, title, duration = 5000, onClose }: ToastProps) {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const start = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            if (remaining <= 0) {
                clearInterval(timer);
                onClose();
            }
        }, 30);

        return () => clearInterval(timer);
    }, [duration, onClose]);

    const isSuccess = type === 'success';

    return (
        <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full pointer-events-auto"
        >
            <div
                className="relative overflow-hidden rounded-xl border shadow-2xl backdrop-blur-xl"
                style={{
                    background: isSuccess
                        ? 'rgba(16, 185, 129, 0.08)'
                        : 'rgba(239, 68, 68, 0.08)',
                    borderColor: isSuccess
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                    boxShadow: isSuccess
                        ? '0 20px 60px rgba(16, 185, 129, 0.15)'
                        : '0 20px 60px rgba(239, 68, 68, 0.15)',
                }}
            >
                <div className="flex items-start gap-3 p-4">
                    {/* Icon */}
                    <div
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                            background: isSuccess
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)',
                        }}
                    >
                        {isSuccess ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${isSuccess ? 'text-green-300' : 'text-red-300'}`}>
                            {title ?? (isSuccess ? '✓ Sent' : '✗ Error')}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 p-1 rounded-md text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress bar */}
                <div className="h-[2px] w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                        className="h-full"
                        style={{
                            width: `${progress}%`,
                            background: isSuccess
                                ? 'rgba(16, 185, 129, 0.6)'
                                : 'rgba(239, 68, 68, 0.6)',
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

/* Wrapper to manage toast from a portal-like fixed container */
export function ToastContainer({ toast, onClose }: { toast: { message: string; type: ToastType; title?: string } | null; onClose: () => void }) {
    return (
        <AnimatePresence>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    title={toast.title}
                    onClose={onClose}
                />
            )}
        </AnimatePresence>
    );
}
