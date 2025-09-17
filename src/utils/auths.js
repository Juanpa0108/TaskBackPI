import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * Genera un hash seguro de la contraseña proporcionada.
 * @async
 * @function hashPassword
 * @param {string} password - Contraseña en texto plano a encriptar.
 * @returns {Promise<string>} Hash de la contraseña.
 */
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

/**
 * Verifica si una contraseña ingresada coincide con un hash almacenado.
 * @async
 * @function checkPassword
 * @param {string} enterPassword - Contraseña ingresada por el usuario.
 * @param {string} hash - Hash almacenado de la contraseña original.
 * @returns {Promise<boolean>} `true` si la contraseña coincide, `false` en caso contrario.
 */
export const checkPassword = async (enterPassword, hash) => { 
    const result = await bcrypt.compare(enterPassword, hash)
    return result
}

/**
 * Genera un token JWT firmado con los datos proporcionados.
 * @function generateToken
 * @param {Object} payload - Datos que se incluirán en el token.
 * @param {string|number} payload.id - Identificador del usuario.
 * @returns {string} Token JWT válido por 2 horas.
 */
export const generateToken = (payload)  => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '2h'
    })
}

/**
 * Verifica y decodifica un token JWT.
 * @function verifyToken
 * @param {string} token - Token JWT a verificar.
 * @returns {Object} Datos decodificados del token.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

/**
 * Valida si un correo electrónico cumple con el formato RFC 5322.
 * @function validateEmail
 * @param {string} email - Correo electrónico a validar.
 * @returns {boolean} `true` si el correo es válido, `false` en caso contrario.
 */
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return emailRegex.test(email)
}

/**
 * Extrae el id de un JWT
 * @param {string} token - El token JWT recibido (sin "Bearer ")
 * @returns {string|null} id del usuario o null si el token no es válido
 */
export const getUserIdFromToken = (token) => {
  try {
    // Verificamos el token con la misma secret que usaste al firmarlo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // Retornamos el id del usuario
  } catch (error) {
    console.error("Error al verificar token:", error.message);
    return null;
  }
};
