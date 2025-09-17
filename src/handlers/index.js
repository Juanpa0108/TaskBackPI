import User from "../models/User.js";
import { hashPassword, checkPassword, generateToken } from "../utils/auths.js";
import { AuthEmail } from "../emails/AuthEmail.js";

/**
 * Crea una nueva cuenta de usuario.
 * 
 * @async
 * @function createAccount
 * @param {Request} req Objeto de solicitud HTTP
 * @param {Response} res Objeto de respuesta HTTP
 * @returns {Promise<void>}
 */
export const createAccount = async (req, res) => {
  try {
    const { email, password, age } = req.body;

    if (age <= 13) {
      return res.status(403).json({ error: "Debes ser mayor de 13 años para registrarte" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: "Un usuario con ese email ya está registrado" });
    }

    const user = new User(req.body);
    user.password = await hashPassword(password);
    user.createdAt = new Date();
    await user.save();

    return res.status(201).json({
      message: "Usuario creado con éxito",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age
      },
      redirect: "/login.html"//posible redireccionamiento a login 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Hubo un error en el servidor" });
  }
};

/**
 * Inicia sesión de usuario.
 *
 * @async
 * @function loginUser
 * @param {Request} req Objeto de solicitud HTTP
 * @param {Response} res Objeto de respuesta HTTP
 * @returns {Promise<void>}
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Correo o contraseña inválidos" });
    }

    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({ error: "Correo o contraseña inválidos" });
    }

    if (user.loginAttempts && user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    const token = generateToken({ id: user.id });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      redirect: "/mainDashBoard.html"
    });
  } catch (error) {
    console.error("Error en loginUser:", error);
    res.status(500).json({ error: "Inténtalo de nuevo más tarde" });
  }
};

/**
 * Cierra sesión de usuario.
 *
 * @async
 * @function logoutUser
 * @param {Request} req Objeto de solicitud HTTP
 * @param {Response} res Objeto de respuesta HTTP
 * @returns {Promise<void>}
 */
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    res.status(200).json({
      message: "Sesión cerrada correctamente",
      redirect: "/index.html"
    });
  } catch (error) {
    console.error("Error en logoutUser:", error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};

/**
 * Obtiene el usuario actual autenticado.
 *
 * @async
 * @function getCurrentUser
 * @param {Request} req Objeto de solicitud HTTP
 * @param {Response} res Objeto de respuesta HTTP
 * @returns {Promise<void>}
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error en getCurrentUser:", error);
    res.status(500).json({ error: "Error al obtener datos del usuario" });
  }
};

/**
 * Verifica si un usuario está autenticado.
 *
 * @async
 * @function verifyAuth
 * @param {Request} req Objeto de solicitud HTTP
 * @param {Response} res Objeto de respuesta HTTP
 * @returns {Promise<void>}
 */
export const verifyAuth = async (req, res) => {
  try {
    res.status(200).json({
      valid: true,
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: "Token inválido" });
  }
};

/**
 * Inicia el proceso de recuperación de contraseña.
 *
 * @async
 * @function forgotPassword
 * @param {Request} req Objeto de solicitud HTTP
 * @param {Response} res Objeto de respuesta HTTP
 * @returns {Promise<void>}
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("No existe un usuario con ese email");
    return res.status(404).json({ error: error.message });
  }

  await AuthEmail.sendConfirmationEmail({ name: user.firstName, email: user.email, id: user._id });

  res.json({ msg: "Hemos enviado un email con las instrucciones" });
};

/**
 * Restablece la contraseña de un usuario a partir de un id recibido en los query params.
 *
 * @async
 * @function resetPassword
 * @param {Object} req - Objeto de petición HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Respuesta HTTP con mensaje de éxito o error.
 *
 * @example
 * // POST /reset-password?id=123
 * // Body: { "password": "12345678", "confirmPassword": "12345678" }
 * // Response: { "msg": "Contraseña actualizada correctamente" }
 */

export const resetPassword = async (req, res) => {
  const {password, confirmPassword} = req.body;
  const {id} = req.query;

  if(password !== confirmPassword) {
    return res.status(400).json({error: "Las contraseñas no coinciden"});
  }
  const user = await User.findById(id);
  if(!user) {
    return res.status(404).json({error: "Usuario no encontrado"});
  }
  user.password = await hashPassword(password);
  await user.save();
  res.json({msg: "Contraseña actualizada correctamente"});
}

/**
 * Obtiene un usuario por su ID desde los query params.
 * Excluye ciertos campos sensibles en la respuesta.
 *
 * @async
 * @function getUserById
 * @param {Object} req - Objeto de petición HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Respuesta HTTP con el objeto usuario o un error.
 *
 * @example
 * // GET /user?id=123
 * // Response: { "user": { "_id": "123", ... } }
 */
export const getUserById = async (req, res) => {
  const { id } = req.query;
  try {
    const user = await User.findById(id).select('-firstName -lastName -age -email');
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error en getUserById:", error);
    res.status(500).json({ error: "Error al obtener datos del usuario" });
  }
}


/**
 * Actualiza los datos de un usuario autenticado.
 * Solo se actualizan los campos que no sean null, undefined o string vacío.
 *
 * @async
 * @function updateUser
 * @param {Object} req - Objeto de petición HTTP. Se espera que `req.user` contenga el id del usuario autenticado.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Respuesta HTTP con el usuario actualizado o un error.
 *
 * @example
 * // PUT /user
 * // Body: { "firstName": "Juan", "age": 25 }
 * // Response: { "message": "Usuario actualizado correctamente", "user": {...} }
 */
export const updateUser = async (req, res) => {
  const { id } = req.user;
  const updates = req.body;

  try {
    const user = await User.findById(id); 
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Solo actualiza si el valor no es null, undefined o string vacío
    Object.keys(updates).forEach((key) => {
      const value = updates[key];
      if (value !== null && value !== undefined && value !== "") {
        user[key] = value;
      }
    });

    await user.save();
    res.status(200).json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(500).json({ error: "Error al actualizar datos del usuario" });
  }
};
