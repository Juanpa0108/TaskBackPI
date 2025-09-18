import nodemailer from 'nodemailer';
import { transport } from '../config/nodemailer.js';

/**
 * Class for handling authentication emails.
 */
export class AuthEmail {
    /**
     * Sends a confirmation email to reset the password.
     *
     * @async
     * @function sendConfirmationEmail
     * @memberof AuthEmail
     * @static
     * @param {Object} user - User information.
     * @param {string} user.name - User's name.
     * @param {string} user.email - User's email address.
     * @param {string} user.token - Unique token to reset the password.
     * @returns {Promise<void>} -Does not return anything, only sends the email.
     */
    static sendConfirmationEmail = async (user) => {
        //  If there are no SMTP environment variables, use Ethereal for testing
        if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            const testAccount = await nodemailer.createTestAccount();
            tx = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            console.log('ℹ️ Usando cuenta de prueba Ethereal para envío de correo');
        }

        const email = await tx.sendMail({
            from: 'Task App - Administrador de Proyectos <admin@taskflow.com>',
            to: user.email,
            subject: 'Restablece tu contraseña en TaskFlow',
            html: `
                <p>Hola ${user.name}, has solicitado restablecer tu contraseña en TaskFlow.</p>
                <p>Haz click en el siguiente enlace para generar una nueva: 
                <a href="${process.env.FRONTEND_URL}/resetPassword?id=${user.id}">Restablecer Contraseña</a></p>
                <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
            `
        });
        console.log('mensaje enviado', email.messageId);
        const previewUrl = nodemailer.getTestMessageUrl(email);
        if (previewUrl) {
            console.log('📨 Vista previa del email (Ethereal):', previewUrl);
        }
    }
}
