import mongoose from "mongoose";
import colors  from 'colors'

export const connectDB:() => Promise<void> = async ():Promise<void> => {
    try{ 
        const {connection} = await mongoose.connect(process.env.MONGO_URI || '')
        const url:string = `${connection.host}:${connection.port}`
        console.log(colors.cyan.bold(`MongoDB Conectado en ${url}`))
    }catch(error:any){
        console.log(colors.bgRed.white.bold(error.message))
        process.exit(1)
    }
}