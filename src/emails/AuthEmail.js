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
