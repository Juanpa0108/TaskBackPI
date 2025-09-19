import { transport } from '../config/nodemailer.js';

/**
 * Class for handling authentication-related emails.
 */
export class AuthEmail {
    /**
   * Sends a confirmation email to reset the user's password.
   *
   * @async
   * @function sendConfirmationEmail
   * @memberof AuthEmail
   * @static
   * @param {Object} user - User information.
   * @param {string} user.name - User's name.
   * @param {string} user.email - User's email address.
   * @param {string} user.token - Unique token to reset the password.
   * @returns {Promise<void>} - Does not return anything, only sends the email.
   */
    static sendConfirmationEmail = async (user) => {
        const email = await transport.sendMail({
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
    }
}