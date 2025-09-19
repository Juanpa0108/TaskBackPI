import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();


/**
 * Configuration for the email transport.
 * Values are retrieved from environment variables.
 *
 * @function
 * @returns {Object} Nodemailer configuration object
 * @property {string} host - SMTP server of the email provider
 * @property {number} port - SMTP port (e.g., 465 or 587)
 * @property {Object} auth - Authentication credentials
 * @property {string} auth.user - Email account username
 * @property {string} auth.pass - Email account password or app token
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
 * Nodemailer transport instance configured with credentials.
 *
 * @constant {import("nodemailer").Transporter}
 */
export const transport = nodemailer.createTransport(config());