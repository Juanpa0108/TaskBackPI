import { Router } from "express"
import { body } from "express-validator"
import { 
    createAccount, 
    loginUser, 
    logoutUser, 
    getCurrentUser,
    verifyAuth,
    forgotPassword
} from "./handlers/index.js"
import { handleInputErrors } from "./middleware/validation.js"
import { requireAuth, requireGuest } from "./middleware/auth.js"

const router = Router()

/**
 * @module Router
 * @description Rutas principales de autenticación y acceso del sistema.
 */

/**
 * Registro de usuario.
 * @name POST /auth/register
 * @function
 * @memberof module:Router
 * @param {string} firstName - Nombre del usuario (mínimo 2, máximo 50 caracteres).
 * @param {string} lastName - Apellido del usuario (mínimo 2, máximo 50 caracteres).
 * @param {string} email - Correo electrónico válido.
 * @param {number} age - Edad del usuario (entre 12 y 120).
 * @param {string} password - Contraseña con mínimo 8 caracteres, incluyendo mayúscula, minúscula y número.
 */
router.post(
    "/auth/register",
    requireGuest,
    body("firstName")
        .notEmpty().withMessage("El nombre es obligatorio")
        .trim().isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres"),
    body("lastName")
        .notEmpty().withMessage("El apellido es obligatorio")
        .trim().isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres"),
    body("email")
        .isEmail().withMessage("El email no es válido")
        .normalizeEmail(),
    body("age")
        .isInt({ min: 12, max: 120 }).withMessage("La edad debe estar entre 12 y 120 años")
        .toInt(),
    body("password")
        .isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage("La contraseña debe contener al menos: una mayúscula, una minúscula y un número"),
    handleInputErrors,
    createAccount
)

/**
 * Login de usuario.
 * @name POST /auth/login
 * @function
 * @memberof module:Router
 * @param {string} email - Correo electrónico válido.
 * @param {string} password - Contraseña con mínimo 8 caracteres.
 */
router.post(
    "/auth/login",
    body("email").isEmail().withMessage("El email no es válido").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres"),
    handleInputErrors,
    loginUser
)

/**
 * Logout de usuario.
 * @name POST /auth/logout
 * @function
 * @memberof module:Router
 */
router.post(
    "/auth/logout",
    requireAuth,
    logoutUser
)

/**
 * Obtener usuario actual autenticado.
 * @name GET /auth/user
 * @function
 * @memberof module:Router
 */
router.get(
    "/auth/user",
    requireAuth,
    getCurrentUser
)

/**
 * Verificar si el token es válido.
 * @name GET /auth/verify
 * @function
 * @memberof module:Router
 */
router.get(
    "/auth/verify",
    requireAuth,
    verifyAuth
)

/**
 * Ruta protegida de ejemplo: Dashboard.
 * @name GET /mainDashBoard.html
 * @function
 * @memberof module:Router
 */
router.get(
    "/mainDashBoard.html",
    requireAuth,
    (req, res) => {
        res.status(200).json({
            message: `Hola, ${req.user.firstName}`,
            user: {
                id: req.user.id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email
            }
        })
    }
)

/**
 * Recuperación de contraseña.
 * @name POST /forgot-password
 * @function
 * @memberof module:Router
 * @param {string} email - Correo electrónico válido.
 */
router.post(
    "/forgot-password",
    body("email").isEmail().withMessage("El email no es válido"),
    handleInputErrors,
    forgotPassword
)

export default router
