import express from 'express'
import cors from 'cors'
import router from './router'
import 'dotenv/config'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'
import cookieParser from 'cookie-parser';

const app = express()

connectDB()

//Cors
app.use(cors(corsConfig))

//leer datos de formulario 
app.use(express.json())

//Routing
app.use('/', router)

app.use(cookieParser());

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    
    // Errores de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token inválido' });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
    }
    
    // Error genérico
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'Error interno del servidor' 
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});


export default app