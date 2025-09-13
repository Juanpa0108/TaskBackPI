import User from "../models/User"
import { Request, Response } from "express"
import { hashPassword, checkPassword, generateToken } from "../utils/auths"
import { AuthEmail } from "../emails/AuthEmail"


export const createAccount = async (req: Request, res: Response) => {
  try {
    const { email, password, age } = req.body

    // Validar edad mínima
    if (age <= 13) {
      return res.status(403).json({
        error: "Debes ser mayor de 13 años para registrarte"
      })
    }

    // Validar usuario existente
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(409).json({
        error: "Un usuario con ese email ya está registrado"
      })
    }

    // Crear usuario
    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.createdAt = new Date()
    await user.save()

    // Respuesta en formato JSON ✅
    return res.status(201).json({
      message: "Usuario creado con éxito",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age
      }
    })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      error: "Hubo un error en el servidor"
    })
  }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                error: "Correo o contraseña inválidos" 
            });
        }

        // Verificar si la cuenta está bloqueada
        //if (user.isLocked) {
           // await user.incLoginAttempts();
           // return res.status(423).json({ 
                //error: "Cuenta temporalmente bloqueada. Inténtalo más tarde." 
          //  });
      //  }

        // Verificar contraseña
        const isPasswordValid = await checkPassword(password, user.password);
        if (!isPasswordValid) {
            await user.incLoginAttempts();
            return res.status(401).json({ 
                error: "Correo o contraseña inválidos" 
            });
        }

        // Login exitoso - resetear intentos
        if (user.loginAttempts && user.loginAttempts > 0) {
            await user.resetLoginAttempts();
        }

        // Generar token
        const token = generateToken({
            id: user.id
            
        });

        // Configurar cookie segura
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 60 * 60 * 1000 // 2 horas
        });

        // Respuesta exitosa
        res.status(200).json({
            message: "Login exitoso",
            token, // También enviamos el token en la respuesta para localStorage si es necesario
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            redirect: '/mainDashBoard.html'
        });

    } catch (error: any) {
        console.error('Error en loginUser:', error);
        res.status(500).json({ 
            error: "Inténtalo de nuevo más tarde" 
        });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        // Limpiar cookie
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            message: "Sesión cerrada correctamente",
            redirect: '/index.html'
        });

    } catch (error: any) {
        console.error('Error en logoutUser:', error);
        res.status(500).json({ 
            error: "Error al cerrar sesión" 
        });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
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

    } catch (error: any) {
        console.error('Error en getCurrentUser:', error);
        res.status(500).json({ 
            error: "Error al obtener datos del usuario" 
        });
    }
};

export const verifyAuth = async (req: Request, res: Response) => {
    try {
        // Si llegamos aquí, el middleware de auth ya validó el token
        res.status(200).json({
            valid: true,
            user: {
                id: req.user.id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email
            }
        });
    } catch (error: any) {
        res.status(401).json({ 
            valid: false,
            error: "Token inválido" 
        });
    }
};
export const forgotPassword = async (req:Request, res:any) => {
  const {email} = req.body
  const user = await User.findOne({email})

  if(!user){
    const error = new Error("No existe un usuario con ese email")
    return res.status(404).json({error: error.message})
  }

  const token = 'aasdasdadsasdasd';
  await AuthEmail.sendConfirmationEmail({name: user.firstName, email: user.email, token})

  res.json({msg: 'Hemos enviado un email con las instrucciones'})
}

