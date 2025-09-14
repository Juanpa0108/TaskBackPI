import mongoose, { Schema } from "mongoose"

/**
 * Esquema de usuario en MongoDB.
 * Contiene la información personal, credenciales y seguridad de login.
 * 
 * @constant
 * @type {mongoose.Schema}
 */
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

/**
 * Verifica si la cuenta del usuario está bloqueada.
 * @function isLocked
 * @memberof userSchema.methods
 * @returns {boolean} `true` si el usuario está bloqueado, `false` en caso contrario.
 */
userSchema.methods.isLocked = function() {
    return this.lockUntil && this.lockUntil.getTime() > Date.now()
}

/**
 * Incrementa los intentos fallidos de inicio de sesión del usuario.
 * Si llega a 5 intentos, bloquea la cuenta por 15 minutos.
 * @function incLoginAttempts
 * @memberof userSchema.methods
 * @returns {Promise<mongoose.UpdateWriteOpResult>} Resultado de la operación de actualización.
 */
userSchema.methods.incLoginAttempts = function() {
    if (this.lockUntil && this.lockUntil.getTime() < Date.now()) {
        return this.updateOne({
            $unset: { loginAttempts: 1, lockUntil: 1 }
        })
    }

    const newAttempts = (this.loginAttempts || 0) + 1
    
    if (newAttempts >= 5) {
        return this.updateOne({
            $set: {
                loginAttempts: newAttempts,
                lockUntil: new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
            }
        })
    } else {
        return this.updateOne({
            $set: { loginAttempts: newAttempts }
        })
    }
}

/**
 * Reinicia los intentos de login fallidos y desbloquea la cuenta.
 * @function resetLoginAttempts
 * @memberof userSchema.methods
 * @returns {Promise<mongoose.UpdateWriteOpResult>} Resultado de la operación de actualización.
 */
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
    })
}

/**
 * Modelo de usuario basado en el esquema `userSchema`.
 * 
 * @constant
 * @type {mongoose.Model<mongoose.Document>}
 */
/** @type {IUser} */
const User = mongoose.model('User', userSchema);
export default User

