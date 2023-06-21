import { sequelize } from "./db/db.js";
import {PORT} from "../config.js"
// import listEndpoints from "express-list-endpoints";

// importamos el archivo de la base de datos que hace la conecxion
import app from "./app.js";
// importamos la estructura de la conecxion de la base de datos y las router de todos los controladores del proyecto
async function main(){
    try {
        await sequelize.authenticate();
        // es la autenticacion de la base de datos con el achivo indexedDB.js
        await sequelize.sync({force:false})
        // la promesa de sequelize.sync es para volver a reestructurar los modelos cambiando el false a true
        app.listen(PORT)
        // app.listen( es el puerto de escucha con el proycto que se conectara para poder iniciar el servicio del backend se puede cambiar el numero de puerto por defecto es 3000)
        console.log("Connection has been established successfully "+ PORT);
    //    const routes = listEndpoints(app);
    //    routes.forEach((route)=>{
    //     console.log(`${route.methods.join(',')} - ${route.path}`)
    //    })
    //    app.get('/', (req, res) => {
    //     res.send(routes);
    //   });
    
        
    } catch (error) {
        console.log('no hay conexion con la base de datos',error);
    }
}
// este codigo de la funcion de main es la conecxion de la base de datos que importamos que el inicializa todo los modelos de dicha estructura en la base de datos postgress

main()
