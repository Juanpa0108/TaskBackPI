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
    getUserById
} from "./handlers/index.js"
import { handleInputErrors } from "./middleware/validation.js"
import { requireAuth, requireGuest } from "./middleware/auth.js"
import Task from "./models/Tasks.js"

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

/**
 * Recuperación de contraseña.
 * @name POST /reset-password
 * @function
 * @memberof module:Router
 * @param {string} password - contraseña válido.
 * @param {string} confirmPassword - contraseña válido.
 * 
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
    "/update-user",
    body("firstName")
        .optional(),
    body("lastName")
        .optional(),
    body("email")
        .optional(),
    body("age")
        .optional(),
    body("password")
        .optional(),
       handleInputErrors,
        requireAuth,
)

// ============================================
// 📋 RUTAS DE GESTIÓN DE TAREAS
// ============================================

/**
 * Crear nueva tarea.
 * @name POST /api/tasks
 */
router.post(
    "/api/tasks",
    body("title").notEmpty().withMessage("El título es obligatorio").trim(),
    body("description").notEmpty().withMessage("La descripción es obligatoria").trim(),
    body("priority").isIn(['low', 'medium', 'high']).withMessage("La prioridad debe ser: low, medium o high"),
    body("status").isIn(['todo', 'inProgress', 'done']).withMessage("El estado debe ser: todo, inProgress o done"),
    body("start").isISO8601().withMessage("La fecha de inicio debe ser válida"),
    body("end").isISO8601().withMessage("La fecha de finalización debe ser válida"),
    handleInputErrors,
    async (req, res) => {
        try {
            console.log("📝 Creando nueva tarea con datos:", req.body);
            
            const { title, description, priority, status, start, end, user } = req.body;

            const newTask = new Task({
                title,
                description,
                priority,
                status,
                start,
                end,
                user,
            });

            await newTask.save();
            console.log("✅ Tarea creada exitosamente:", newTask);
            res.status(201).json(newTask);
        } catch (err) {
            console.error("❌ Error creando tarea:", err);
            res.status(500).json({ error: err.message });
        }
    }
)

/**
 * Obtener todas las tareas.
 * @name GET /api/tasks
 */
router.get(
    "/api/tasks",
    async (req, res) => {
        try {
            console.log("📋 Obteniendo todas las tareas");
            const tasks = await Task.find().populate("user", "firstName lastName email");
            console.log('✅ Se encontraron ${tasks.length} tareas');
            res.json(tasks);
        } catch (err) {
            console.error("❌ Error obteniendo tareas:", err);
            res.status(500).json({ error: err.message });
        }
    }
)

/**
 * Actualizar tarea.
 * @name PUT /api/tasks/:id
 */
router.put(
    "/api/tasks/:id",
    body("title").optional().notEmpty().withMessage("El título no puede estar vacío").trim(),
    body("description").optional().notEmpty().withMessage("La descripción no puede estar vacía").trim(),
    body("priority").optional().isIn(['low', 'medium', 'high']).withMessage("La prioridad debe ser: low, medium o high"),
    body("status").optional().isIn(['todo', 'inProgress', 'done']).withMessage("El estado debe ser: todo, inProgress o done"),
    body("start").optional().isISO8601().withMessage("La fecha de inicio debe ser válida"),
    body("end").optional().isISO8601().withMessage("La fecha de finalización debe ser válida"),
    handleInputErrors,
    async (req, res) => {
        try {
            console.log("✏ Actualizando tarea con ID:", req.params.id);
            console.log("Datos a actualizar:", req.body);
            
            const { title, description, priority, status, start, end } = req.body;
            
            const updatedTask = await Task.findByIdAndUpdate(
                req.params.id,
                {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(priority && { priority }),
                    ...(status && { status }),
                    ...(start && { start }),
                    ...(end && { end }),
                },
                { 
                    new: true,
                    runValidators: true
                }
            ).populate("user", "firstName lastName email");

            if (!updatedTask) {
                return res.status(404).json({ error: "Tarea no encontrada" });
            }

            console.log("✅ Tarea actualizada exitosamente:", updatedTask);
            res.json(updatedTask);
        } catch (err) {
            console.error("❌ Error actualizando tarea:", err);
            res.status(500).json({ error: err.message });
        }
    }
)

/**
 * Eliminar tarea.
 * @name DELETE /api/tasks/:id
 */
router.delete(
    "/api/tasks/:id",
    async (req, res) => {
        try {
            console.log("🗑 Eliminando tarea con ID:", req.params.id);
            
            const deletedTask = await Task.findByIdAndDelete(req.params.id);
            
            if (!deletedTask) {
                return res.status(404).json({ error: "Tarea no encontrada" });
            }

            console.log("✅ Tarea eliminada exitosamente:", deletedTask);
            res.json({ message: "Tarea eliminada exitosamente", task: deletedTask });
        } catch (err) {
            console.error("❌ Error eliminando tarea:", err);
            res.status(500).json({ error: err.message });
        }
    }
)

export default router