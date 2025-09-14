import mongoose from "mongoose";
import colors from "colors";

/**
 * Conecta la aplicación a la base de datos MongoDB usando mongoose.
 *
 * La URI de conexión se obtiene desde la variable de entorno `MONGO_URI`.
 * Si la conexión es exitosa, muestra en consola el host y puerto de MongoDB.
 * Si ocurre un error, imprime el mensaje en rojo y termina el proceso.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Una promesa que se resuelve cuando la conexión es exitosa o el proceso termina en caso de error.
 */
export const connectDB = async () => {
    try { 
        const { connection } = await mongoose.connect(process.env.MONGO_URI || "");
        const url = `${connection.host}:${connection.port}`;
        console.log(colors.cyan.bold(`MongoDB Conectado en ${url}`));
    } catch (error) {
        console.log(colors.bgRed.white.bold(error.message));
        process.exit(1);
    }
};
