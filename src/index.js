import colors from 'colors'
import app from './server.js'

/**
 * Port on which the application runs.
 * Taken from the environment variable `PORT` or defaults to 4000.
 * @type {number|string}
 */
const port = process.env.PORT || 4000

/**
 * Starts the Express server on the specified port.
 * 
 * @function
 * @returns {void}
 */
app.listen(port, () => {
    console.log(colors.blue.bold(`Servidor conectado en el puerto ${port}`))
})
