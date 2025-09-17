import express from 'express'
import cors from 'cors'
import router from './router.js'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import { corsConfig } from './config/cors.js'
import cookieParser from 'cookie-parser'

/**
 * Instancia principal de la aplicación Express.
 * @type {Application}
 */
const app = express()

/**
 * Conexión a la base de datos.
 * @function
 */
connectDB()

/**
 * Middleware de CORS con la configuración definida en corsConfig.
 */
app.use(cors(corsConfig))

/**
 * Middleware para parsear cuerpos de solicitudes en formato JSON.
 */
app.use(express.json())

/**
 * Router principal de la aplicación.
 */
app.use('/', router)


/**
 * Middleware para parsear cookies en las solicitudes.
 */
app.use(cookieParser())

/**
 * Middleware de manejo de errores global.
 * 
 * - Maneja errores relacionados con JWT (token inválido o expirado).
 * - Retorna mensajes de error detallados en entorno de desarrollo.
 * - En producción retorna un mensaje genérico.
 * 
 * @param {Error} err - Objeto de error lanzado.
 * @param {Request} req - Objeto de solicitud.
 * @param {Response} res - Objeto de respuesta.
 * @param {NextFunction} next - Función para pasar al siguiente middleware.
 */
app.use((err, req, res, next) => {
    console.error('Error:', err)
    
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token inválido' })
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' })
    }
    
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'Error interno del servidor' 
    })
})

/**
 * Middleware para manejar rutas inexistentes (404).
 * 
 * @param {Request} req - Objeto de solicitud.
 * @param {Response} res - Objeto de respuesta.
 */
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' })
})

export default app