import {transport} from '../config/nodemailer';

type EmailType = {
    name:string, 
    email:string, 
    token:string
}

export class AuthEmail {

    static sendConfirmationEmail = async (user:EmailType) => {
        const email = await transport.sendMail({
            from: 'Task App - Administrador de Proyectos <admin@taskflow.com>',
            to: user.email,
            subject: 'Restablece tu contraseña en Task App',
            html: `<p>Hola ${user.name}, has solicitado restablecer tu contraseña en Task App.</p>
            <p>Haz click en el siguiente enlace para generar una nueva: 
            <a href="${process.env.FRONTEND_URL}/auth/forgot-password/${user.token}">Restablecer Contraseña</a></p>
            <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>`
        })
        console.log('mensaje enviado', email.messageId);
    }


}