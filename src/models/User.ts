import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/User.interface";

const userSchema: mongoose.Schema = new Schema({
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
});

// Método para verificar si está bloqueado (más simple que virtual)
userSchema.methods.isLocked = function() {
    return this.lockUntil && this.lockUntil.getTime() > Date.now();
};

// Método para incrementar intentos
userSchema.methods.incLoginAttempts = function() {
    if (this.lockUntil && this.lockUntil.getTime() < Date.now()) {
        return this.updateOne({
            $unset: { loginAttempts: 1, lockUntil: 1 }
        });
    }

    const newAttempts = (this.loginAttempts || 0) + 1;
    
    if (newAttempts >= 5) {
        return this.updateOne({
            $set: {
                loginAttempts: newAttempts,
                lockUntil: new Date(Date.now() + 15 * 60 * 1000)
            }
        });
    } else {
        return this.updateOne({
            $set: { loginAttempts: newAttempts }
        });
    }
};

userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
    });
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;