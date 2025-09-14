import { validationResult } from 'express-validator';

/**
 * Middleware que maneja los errores de validación generados por express-validator.
 * 
 * - Si existen errores en la request, responde con status 400 y el array de errores.
 * - Si no hay errores, continúa con el siguiente middleware.
 * 
 * @param {Request} req Objeto de la petición.
 * @param {Response} res Objeto de la respuesta.
 * @param {NextFunction} next Función que pasa al siguiente middleware.
 * @returns {void|Response} Respuesta con errores o llamada a `next()`.
 */
export const handleInputErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};
