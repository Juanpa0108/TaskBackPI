import { verifyToken } from '../utils/auths.js';
import User from '../models/User.js';

/**
 * Middleware para autenticar al usuario con JWT.
 * 
 * @param {Request} req Objeto de la petición.
 * @param {Response} res Objeto de la respuesta.
 * @param {NextFunction} next Función para continuar al siguiente middleware.
 * @returns {Promise<void>}
 */
export const authenticate = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization;

        if (!bearer) {
            const error = new Error("No autorizado");
            return res.status(401).json({ error: error.message });
        }

        const [, token] = bearer.split(' ');

        if (!token) {
            const error = new Error("No autorizado");
            return res.status(401).json({ error: error.message });
        }

        const result = verifyToken(token);
        if (typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password');
            if (!user) {
                const error = new Error("El usuario no existe");
                return res.status(404).json({ error: error.message });
            }
            req.user = user;
            return next();
        }
    } catch (error) {
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

/**
 * Middleware alias para exigir autenticación.
 * @type {Function}
 */
export const requireAuth = authenticate;

/**
 * Middleware para rutas que requieren estar deslogueado
 * (ejemplo: login o registro).
 * 
 * @param {Request} req Objeto de la petición.
 * @param {Response} res Objeto de la respuesta.
 * @param {NextFunction} next Función para continuar.
 */
export const requireGuest = (req, res, next) => {
    let token;

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
