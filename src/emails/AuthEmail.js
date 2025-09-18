import nodemailer from 'nodemailer';
import { transport } from '../config/nodemailer.js';

/**
 * Clase para el manejo de correos electrónicos de autenticación.
 */
export class AuthEmail {
    /**
     * Envía un correo de confirmación para restablecer la contraseña.
     *
     * @async
     * @function sendConfirmationEmail
     * @memberof AuthEmail
     * @static
     * @param {Object} user - Información del usuario.
     * @param {string} user.name - Nombre del usuario.
     * @param {string} user.email - Correo electrónico del usuario.
     * @param {string} user.token - Token único para restablecer la contraseña.
     * @returns {Promise<void>} - No retorna nada, solo envía el correo.
     */
    static sendConfirmationEmail = async (user) => {
        // Si no hay variables de entorno de SMTP, usar Ethereal para pruebas
        let tx = transport;
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
