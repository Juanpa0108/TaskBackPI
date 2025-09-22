import { Router } from "express"
import { body } from "express-validator"
import { 
    createAccount, 
    loginUser, 
    logoutUser, 
    getCurrentUser,
    verifyAuth,
    forgotPassword,
    resetPassword,
    getUserById,
    updateUser
} from "./handlers/index.js"
import { handleInputErrors } from "./middleware/validation.js"
import { requireAuth, requireGuest } from "./middleware/auth.js"
import Task from "./models/Tasks.js"

const router = Router()

/**
 * @module Router
 * @description Main authentication and system access routes.
 */

/**
 * User registration.
 * @name POST /auth/register
 * @function
 * @memberof module:Router
 * @param {string} firstName - User's first name (minimum 2, maximum 50 characters).
 * @param {string} lastName - User's last name (minimum 2, maximum 50 characters).
 * @param {string} email - Valid email address.
 * @param {number} age - User's age (between 12 and 120).
 * @param {string} password - Password with at least 8 characters, including uppercase, lowercase, and number.
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
 * User login.
 * @name POST /auth/login
 * @function
 * @memberof module:Router
 * @param {string} email - Valid email address.
 * @param {string} password - Password with at least 8 characters.
 */
router.post(
    "/auth/login",
    body("email").isEmail().withMessage("El email no es válido").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres"),
    handleInputErrors,
    loginUser
)

/**
 * Logout user.
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
 *  Get the currently authenticated user.
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
 * Verify if the token is valid.
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
 * Example protected route: Dashboard.
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
                email: req.user.email,
                age: req.user.age
            }
        })
    }
)

/**
 * Password recovery.
 * @name POST /forgot-password
 * @function
 * @memberof module:Router
 * @param {string} email - Valid email address.
 */
router.post(
    "/forgot-password",
    body("email").isEmail().withMessage("El email no es válido"),
    handleInputErrors,
    forgotPassword
)

/**
 * Password recovery.
 * @name POST /reset-password
 * @function
 * @memberof module:Router
 * @param {string} password - Valid password.
 * @param {string} confirmPassword - Valid password.
 */

router.post(
    "/reset-password",
    body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres"),
    body("confirm-password").isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres"),
    handleInputErrors,
    resetPassword
)

router.get(
    "/get-user-by-id",
    requireAuth,
    getUserById
)

router.patch(
    "/auth/user",
    requireAuth,
    body("firstName").optional(),
    body("lastName").optional(),
    body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
    body("age").optional().isInt({ min: 13, max: 120 }).withMessage("Edad inválida").toInt(),
    body("password").optional().isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres"),
    handleInputErrors,
    updateUser
)

// // ============================================
// 📋 TASK MANAGEMENT ROUTES
// ============================================
// Task routes are handled in task.routes.js

export default router
