import { Router } from "express";
import { body } from "express-validator";
import { 
    createAccount, 
    loginUser, 
    logoutUser, 
    getCurrentUser,
    verifyAuth,
  forgotPassword
} from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { requireAuth, requireGuest } from "./middleware/auth";

const router = Router();

/** Registro de usuario */
router.post(
    "/auth/register",
    requireGuest, // Solo usuarios no autenticados
    body("firstName")
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
    body("lastName")
        .notEmpty()
        .withMessage("El apellido es obligatorio")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("El apellido debe tener entre 2 y 50 caracteres"),
    body("email")
        .isEmail()
        .withMessage("El email no es válido")
        .normalizeEmail(),
    body("age")
        .isInt({ min: 12, max: 120 })
        .withMessage("La edad debe estar entre 12 y 120 años")
        .toInt(),
    body("password")
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener mínimo 8 caracteres")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("La contraseña debe contener al menos: una mayúscula, una minúscula y un número"),
    handleInputErrors,
    createAccount
);

/** Login de usuario */
router.post(
    "/auth/login",
    body("email")
        .isEmail()
        .withMessage("El email no es válido")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener mínimo 8 caracteres"),
    handleInputErrors,
    loginUser
);

/** Logout de usuario */
router.post(
    "/auth/logout",
    requireAuth, // Solo usuarios autenticados
    logoutUser
);

/** Obtener usuario actual */
router.get(
    "/auth/user",
    requireAuth, // Solo usuarios autenticados
    getCurrentUser
);

/** Verificar si el token es válido */
router.get(
    "/auth/verify",
    requireAuth, // Solo usuarios autenticados
    verifyAuth
);

/** Ruta protegida de ejemplo - Dashboard */
router.get(
    "/mainDashBoard.html",
    requireAuth, // Solo usuarios autenticados
    (req, res) => {
        res.status(200).json({
            message: `Hola, ${req.user.firstName}`,
            user: {
                id: req.user.id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email
            }
        });
    }
);

router.post("/forgot-password",
  body("email")
  .isEmail()
  .withMessage("El email no es válido"),
  handleInputErrors,
  forgotPassword
)
export default router;


