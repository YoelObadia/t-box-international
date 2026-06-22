'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getContactFormSchema, type ContactFormInputs } from '@/lib/schema';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { translations } from '@/lib/translations';
import { motion } from 'framer-motion';
import { ToastContainer, type ToastType } from './Toast';

interface ContactFormProps {
    lang: 'fr' | 'en' | 'es' | 'ar';
}

export default function ContactForm({ lang }: ContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType; title?: string } | null>(null);

    // Piège temporel : on enregistre l'heure de chargement du formulaire
    const [loadTime, setLoadTime] = useState<number>(0);
    useEffect(() => {
        setLoadTime(Date.now());
    }, []);

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

        // On récupère la valeur du pot de miel (camouflage en champ Fax)
        const honeypotValue = (document.getElementById('fax_number') as HTMLInputElement)?.value;
        const fillDuration = Date.now() - loadTime;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    fax_number: honeypotValue,
                    fill_duration: fillDuration
                }),
            });

            // Si le serveur renvoie une erreur 429 (Too Many Requests)
            if (response.status === 429) {
                throw new Error('RATE_LIMIT');
            }

            if (!response.ok) throw new Error('Error');

            setToast({
                message: t.toast.successMessage,
                type: 'success',
                title: t.toast.successTitle,
            });
            reset();
        } catch (error) {
            const isRateLimit = error instanceof Error && error.message === 'RATE_LIMIT';
            setToast({
                message: isRateLimit ? "Veuillez patienter un moment avant de renvoyer un message." : t.toast.errorMessage,
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
                    {/* Le code de tes inputs normaux reste exactement le même ici... */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {inputFields.slice(0, 4).map((field) => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="block text-sm text-(--text-secondary) mb-1.5">
                                    {field.label}
                                </label>
                                <input
                                    id={field.id}
                                    type={field.type}
                                    {...register(field.id as keyof ContactFormInputs)}
                                    className="input-modern"
                                />
                            </div>
                        ))}
                    </div>

                    {inputFields.slice(4).map((field) => (
                        <div key={field.id}>
                            <label htmlFor={field.id} className="block text-sm text-(--text-secondary) mb-1.5">
                                {field.label}
                            </label>
                            <input
                                id={field.id}
                                type={field.type}
                                {...register(field.id as keyof ContactFormInputs)}
                                className="input-modern"
                            />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="message" className="block text-sm text-(--text-secondary) mb-1.5">
                            {t.form.message}
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            {...register('message')}
                            className="input-modern resize-none"
                        />
                    </div>

                    {/* --- DÉBUT DU PIÈGE ANTI-BOT --- */}
                    {/* Champ invisible pour les humains, camouflé en "fax_number" pour attirer les bots */}
                    <div 
                        style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }}
                        aria-hidden="true"
                    >
                        <label htmlFor="fax_number">Fax Number</label>
                        <input 
                            type="text" 
                            id="fax_number" 
                            name="fax_number" 
                            tabIndex={-1} 
                            autoComplete="off" 
                        />
                    </div>
                    {/* --- FIN DU PIÈGE ANTI-BOT --- */}

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
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
            <ToastContainer toast={toast} onClose={closeToast} />
        </>
    );
}