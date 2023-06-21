import Express from "express";
// express es una libreria para desarrollo de aplicaciones web para el programadores de nodejs
import cors from "cors"
import bodyParser from "body-parser";
import funcionario from  "./router/controller-router/funcionario-router.js"
import producto from "./router/controller-router/producto-router.js"
import proyecto from "./router/controller-router/proyecto-router.js"
import puntaje from "./router/controller-router/puntaje-router.js"
import semillero from "./router/controller-router/semillero-router.js"
import programas from "./router/controller-router/programa-router.js"
import cookieParser from "cookie-parser"
import fucionario_productos from "./router/controller-router/funcionario-producto-router.js"
import producto_programa from "./router/controller-router/producto_programa-router.js"
// la importacion de los router es para traer todas las api que se crean en los servicios de cada estructura para que el cliente consuma los servicios

const app = Express()

app.use(cors());

app.use(Express.json())
app.use(programas,funcionario,producto,proyecto,puntaje,semillero,fucionario_productos,producto_programa)

//el app.use une todos los servicios para poder ser inicializados en servicios clientes

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use (cookieParser())



export default app;
