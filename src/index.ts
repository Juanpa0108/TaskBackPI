import colors from 'colors'
import app from './server'


const port:string|number = process.env.PORT || 4000
app.listen(port, () =>{
    console.log(colors.blue.bold(`Servidor conectado en el puerto ${port}`))
})