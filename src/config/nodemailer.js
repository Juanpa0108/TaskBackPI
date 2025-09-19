import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();


/**
 * Configuración para el transporte de correo electrónico.
 * Se obtienen los valores desde las variables de entorno.
 *
 * @function
 * @returns {Object} Objeto de configuración para nodemailer
 * @property {string} host - Servidor SMTP del proveedor de correo
 * @property {number} port - Puerto SMTP (ej. 465 o 587)
 * @property {Object} auth - Credenciales de autenticación
 * @property {string} auth.user - Usuario de correo electrónico
 * @property {string} auth.pass - Contraseña o token de aplicación
 */
const config = () => {
    return {
        host: process.env.EMAIL_HOST,
        port: +process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }
}

/**
 * Instancia del transporte de nodemailer configurada con las credenciales.
 * 
 * @constant {Transporter}
 */
export const transport = nodemailer.createTransport(config());