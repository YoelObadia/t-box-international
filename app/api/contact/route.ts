import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { ContactFormSchema } from '@/lib/schema';

// Petit store en mémoire pour le Rate Limiting basique (se réinitialise au redémarrage du serveur)
const rateLimitMap = new Map<string, number>();

export async function POST(request: Request) {
    try {
        const isDev = process.env.NODE_ENV === 'development';

        // --- 1. RATE LIMITING (Anti-Spam en rafale) ---
        // Récupérer l'IP du visiteur
        const ip = request.headers.get('x-forwarded-for') || 'ip-inconnue';

        if (!isDev) {
            const now = Date.now();
            const lastSubmit = rateLimitMap.get(ip);

            // Si la même IP a envoyé un formulaire il y a moins de 60 secondes, on bloque
            if (lastSubmit && now - lastSubmit < 60000) {
                return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
            }
            rateLimitMap.set(ip, now);
        }

        // --- LECTURE DU CORPS DE LA REQUÊTE ---
        const body = await request.json();

        // On sépare les champs de sécurité des vraies données
        const { fax_number, fill_duration, ...formData } = body;

        // --- 2. VÉRIFICATION HONEYPOT (Camouflé en Fax) ---
        if (fax_number && fax_number.length > 0) {
            console.log(`[BOT DETECTION] IP: ${ip} bloquée par Honeypot Fax (Valeur: "${fax_number}")`);
            // On renvoie un statut 200 pour faire croire au bot que ça a marché
            return NextResponse.json({ message: 'Email envoyé avec succès' }, { status: 200 });
        }

        // --- 3. VÉRIFICATION TEMPORELLE (Time Trap basé sur la durée réelle) ---
        if (!isDev && fill_duration) {
            const time = parseInt(fill_duration, 10);
            // Un humain met généralement plus de 3 secondes à remplir un formulaire
            if (time < 3000) {
                console.log(`[BOT DETECTION] IP: ${ip} bloquée par Time Trap (${time}ms)`);
                // Faux succès
                return NextResponse.json({ message: 'Email envoyé avec succès' }, { status: 200 });
            }
        }

        // --- 4. VALIDATION ZOD CLASSIQUE ---
        const result = ContactFormSchema.safeParse(formData);

        if (!result.success) {
            return NextResponse.json({ error: result.error.format() }, { status: 400 });
        }

        // Le reste de ton code ne change pas :
        const { firstname, lastname, email, telephone, address, subject, message } = result.data;

        const gmailUser = process.env.GMAIL_USER;
        const gmailUser1 = process.env.GMAIL_USER1;
        const gmailPass = process.env.GMAIL_PASS;

        if (!gmailUser || !gmailPass) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailPass,
            },
        });

        const recipients = [gmailUser, gmailUser1].filter(Boolean).join(', ');

        await transporter.sendMail({
            from: `"T-Box International" <${gmailUser}>`,
            to: recipients,
            replyTo: email,
            subject: `Nouveau message T-Box : ${subject}`,
            // J'ai gardé ton HTML d'origine, tu n'as rien à changer ici
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 12px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    <p>Prénom: ${firstname} | Nom: ${lastname}</p>
                </div>
            `,
        });

        return NextResponse.json({ message: 'Email envoyé avec succès' }, { status: 200 });
    } catch (error) {
        console.error('Detailed Error sending email:', error);
        return NextResponse.json(
            { error: "Erreur lors de l'envoi de l'email", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}