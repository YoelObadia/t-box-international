'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getContactFormSchema, type ContactFormInputs } from '@/lib/schema';
import { useState, useCallback, useMemo } from 'react';
import { translations } from '@/lib/translations';
import { motion } from 'framer-motion';
import { ToastContainer, type ToastType } from './Toast';

interface ContactFormProps {
    lang: 'fr' | 'en' | 'es' | 'ar';
}

export default function ContactForm({ lang }: ContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType; title?: string } | null>(null);
    const t = translations[lang].contact;
    const schema = useMemo(() => getContactFormSchema(lang), [lang]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormInputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: ContactFormInputs) => {
        setIsSubmitting(true);
        setToast(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Error');

            setToast({
                message: t.toast.successMessage,
                type: 'success',
                title: t.toast.successTitle,
            });
            reset();
        } catch {
            setToast({
                message: t.toast.errorMessage,
                type: 'error',
                title: t.toast.errorTitle,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeToast = useCallback(() => setToast(null), []);

    const inputFields = [
        { id: 'firstname', label: t.form.firstname, type: 'text', error: errors.firstname },
        { id: 'lastname', label: t.form.lastname, type: 'text', error: errors.lastname },
        { id: 'email', label: t.form.email, type: 'email', error: errors.email },
        { id: 'telephone', label: t.form.telephone, type: 'tel', error: errors.telephone },
        { id: 'address', label: t.form.address, type: 'text', error: undefined },
        { id: 'subject', label: t.form.subject, type: 'text', error: errors.subject },
    ] as const;

    return (
        <>
            <div className="glass p-8 rounded-2xl">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {inputFields.slice(0, 4).map((field) => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="block text-sm text-[var(--text-secondary)] mb-1.5">
                                    {field.label}
                                </label>
                                <input
                                    id={field.id}
                                    type={field.type}
                                    {...register(field.id as keyof ContactFormInputs)}
                                    className="input-modern"
                                />
                                {field.error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs mt-1"
                                    >
                                        {field.error.message}
                                    </motion.p>
                                )}
                            </div>
                        ))}
                    </div>

                    {inputFields.slice(4).map((field) => (
                        <div key={field.id}>
                            <label htmlFor={field.id} className="block text-sm text-[var(--text-secondary)] mb-1.5">
                                {field.label}
                            </label>
                            <input
                                id={field.id}
                                type={field.type}
                                {...register(field.id as keyof ContactFormInputs)}
                                className="input-modern"
                            />
                            {field.error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-xs mt-1"
                                >
                                    {field.error.message}
                                </motion.p>
                            )}
                        </div>
                    ))}

                    <div>
                        <label htmlFor="message" className="block text-sm text-[var(--text-secondary)] mb-1.5">
                            {t.form.message}
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            {...register('message')}
                            className="input-modern resize-none"
                        />
                        {errors.message && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-1"
                            >
                                {errors.message.message}
                            </motion.p>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isSubmitting ? (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <>
                                {t.form.submit}
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </motion.button>
                </form>
            </div>

            {/* Floating toast notification */}
            <ToastContainer toast={toast} onClose={closeToast} />
        </>
    );
}
