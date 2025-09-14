/**
 * Representa un usuario en la base de datos.
 * 
 * @typedef {Object} IUser
 * @property {string} firstName Nombre del usuario
 * @property {string} lastName Apellido del usuario
 * @property {number} age Edad
 * @property {string} email Correo electrónico
 * @property {string} password Contraseña hasheada
 * @property {number} [loginAttempts] Intentos fallidos de login
 * @property {Date} [lockUntil] Fecha hasta la que está bloqueado
 * @property {Date} createdAt Fecha de creación
 * 
 * @property {function(): boolean} isLocked Verifica si el usuario está bloqueado
 * @property {function(): Promise<any>} incLoginAttempts Incrementa intentos fallidos
 * @property {function(): Promise<any>} resetLoginAttempts Reinicia intentos fallidos
 */
