import { z } from 'zod';
import { translations } from './translations';

type Lang = 'fr' | 'en' | 'es' | 'ar';

export function getContactFormSchema(lang: Lang) {
    const v = translations[lang].contact.validation;

    return z.object({
        firstname: z.string().min(1, { message: v.firstname }),
        lastname: z.string().min(1, { message: v.lastname }),
        email: z.string().email({ message: v.email }),
        telephone: z.string().min(1, { message: v.telephone }),
        address: z.string().optional(),
        subject: z.string().min(1, { message: v.subject }),
        message: z.string().min(1, { message: v.message }),
    });
}

// Keep a static schema for the API route (server-side validation)
export const ContactFormSchema = z.object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.string().email(),
    telephone: z.string().min(1),
    address: z.string().optional(),
    subject: z.string().min(1),
    message: z.string().min(1),
});

export type ContactFormInputs = z.infer<typeof ContactFormSchema>;
