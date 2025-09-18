import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

/**
 * Configuration for the email transport.
 * Values are obtained from environment variables.
 *
 * @function
 * @returns {Object} Configuration object for nodemailer
 * @property {string} host - SMTP server of the email provider
 * @property {number} port - SMTP port (e.g., 465 or 587)
 * @property {Object} auth - Authentication credentials
 * @property {string} auth.user - Email user
 * @property {string} auth.pass - Password or application token
 */
const config = () => {
    const port = Number(process.env.EMAIL_PORT) || 587
    return {
        host: process.env.EMAIL_HOST,
        port,
        secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            // useful in local environments with self-signed certificates
            rejectUnauthorized: false
        }
    }
}

/**
 * Nodemailer transport instance configured with credentials.
 * 
 * @constant {Transporter}
 */
export const transport = nodemailer.createTransport(config());

export const verifyEmailTransport = async () => {
    try {
        await transport.verify();
        console.log("✉️  SMTP ready to send emails");
    } catch (err) {
        console.error("❌ Error verifying SMTP:", err?.message || err);
    }
}
