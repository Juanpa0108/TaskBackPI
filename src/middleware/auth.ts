import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auths';
import User from '../models/User';
import jwt from "jsonwebtoken"

// Extender Request para incluir user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const bearer = req.headers.authorization

    if(!bearer) {
        const error = new Error ("No autorizado")
        return res.status(401).json({error:error.message})
    }

    const [, token] = bearer.split(' ')

    if(!token) {
        const error = new Error ("No autorizado")
        return res.status(401).json({error:error.message})
    }

    
        const result = verifyToken(token);
        if(typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password')
            if(!user){
                const error = new Error ("El usuario no existe")
                return res.status(404).json({error:error.message})
            }
            req.user = user
            next()
        }
    
    
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: "Token expirado",
                redirect: "/login",
            });
        }

        return res.status(401).json({
            error: "Token inválido",
            redirect: "/login",
        });
    }
};

// Middleware para rutas que requieren estar logueado
export const requireAuth = authenticate;

// Middleware para rutas que requieren estar deslogueado (como login, register)
export const requireGuest = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.cookies?.authToken) {
        token = req.cookies.authToken;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            verifyToken(token);
            return res.status(302).json({ 
                message: 'Ya estás autenticado',
                redirect: '/mainDashBoard.html'
            });
        } catch (error) {
            // Token inválido, continuar
        }
    }

    next();
};