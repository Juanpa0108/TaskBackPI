import {Document} from 'mongoose'

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    loginAttempts?: number;
    lockUntil?: Date;
    createdAt: Date;
    
    // Métodos (ya no virtual)
    isLocked(): boolean;
    incLoginAttempts(): Promise<any>;
    resetLoginAttempts(): Promise<any>;
}