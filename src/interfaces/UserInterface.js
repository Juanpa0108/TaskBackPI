/**
 * Represents a user in the database.
 * 
 * @typedef {Object} IUser
 * @property {string} firstName User's first name
 * @property {string} lastName User's last name
 * @property {number} age Age
 * @property {string} email Email address
 * @property {string} password Hashed password
 * @property {number} [loginAttempts] Failed login attempts
 * @property {Date} [lockUntil] Date until the user is locked
 * @property {Date} createdAt Creation date
 * 
 * @property {function(): boolean} isLocked Checks if the user is locked
 * @property {function(): Promise<any>} incLoginAttempts Increments failed login attempts
 * @property {function(): Promise<any>} resetLoginAttempts Resets failed login attempts
 */
