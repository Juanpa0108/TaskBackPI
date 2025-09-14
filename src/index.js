import colors from 'colors'
import app from './server.js'

/**
 * Puerto en el que se ejecuta la aplicación.
 * Se toma de la variable de entorno `PORT` o por defecto 4000.
 * @type {number|string}
 */
const port = process.env.PORT || 4000

/**
 * Inicia el servidor Express en el puerto especificado.
 * 
 * @function
 * @returns {void}
 */
app.listen(port, () => {
    console.log(colors.blue.bold(`Servidor conectado en el puerto ${port}`))
})
