import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { ContactFormSchema } from '@/lib/schema';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = ContactFormSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.format() }, { status: 400 });
        }

        const { firstname, lastname, email, telephone, address, subject, message } = result.data;

        const gmailUser = process.env.GMAIL_USER;
        const gmailUser1 = process.env.GMAIL_USER1;
        const gmailPass = process.env.GMAIL_PASS;

        if (!gmailUser || !gmailPass) {
            console.error('Missing GMAIL_USER or GMAIL_PASS environment variables');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Gmail SMTP configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailPass,
            },
        });

        // Verify connection configuration
        try {
            await transporter.verify();
        } catch (verifyError) {
            console.error('SMTP Verification Error:', verifyError);
            return NextResponse.json(
                { error: 'Server configuration error: Unable to connect to email service' },
                { status: 500 }
            );
        }

        // Build recipient list
        const recipients = [gmailUser, gmailUser1].filter(Boolean).join(', ');

        // Send email
        await transporter.sendMail({
            from: `"T-Box International" <${gmailUser}>`,
            to: recipients,
            replyTo: email,
            subject: `Nouveau message T-Box : ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 12px;">
                    <div style="background: linear-gradient(135deg, #1a73e8, #0d47a1); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h2 style="color: white; margin: 0;">📬 Nouveau message</h2>
                        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 14px;">T-Box International — Formulaire de contact</p>
                    </div>
                    <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; width: 120px; font-size: 14px;">Prénom</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600; font-size: 14px;">${firstname}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Nom</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600; font-size: 14px;">${lastname}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Email</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;"><a href="mailto:${email}" style="color: #1a73e8;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Téléphone</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${telephone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Adresse</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${address || 'Non fournie'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Sujet</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600; font-size: 14px;">${subject}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #1a73e8;">
                            <p style="margin: 0 0 6px; color: #666; font-size: 13px; font-weight: 600;">Message :</p>
                            <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                    <p style="text-align: center; color: #999; font-size: 12px; margin-top: 16px;">
                        Envoyé depuis le formulaire de contact T-Box International
                    </p>
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
