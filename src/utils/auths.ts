import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/User.interface';

export const hashPassword = async (password:string) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const checkPassword = async (enterPassword:string, hash:string) => { 
    const result = await bcrypt.compare(enterPassword, hash)
    return result
}

// Generate JWT
export const generateToken = (payload: { id: string }): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '2h'
    });
};

// Verify JWT
export const verifyToken = (token: string): any => {
    return jwt.verify(token, process.env.JWT_SECRET!);
};

// Validate email format (RFC 5322 compliant)
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
};