import  {Router} from "express";
// importamos la libreria de express llamamos un objeto router para hacer la conexcion de frontend con el backend 

import { create_semillero, delete_semillero, get_semillero, get_semillero_id, update_semillero } from "../../controller/semillero-controller/semillero-controller.js";

// importamos los contradores o CRUDS que se creo en dicho controlador 
const router = Router()

// creamos una variable la llamamos router la cual se hace la conexcion con la libreria anterior mente llamada router para su correcto funcionarmiento de los servcios

router.get('/semillero',get_semillero)
// router.get es obtener los datos de la base de datos
router.post('/semillero',create_semillero)
// router.post es para llenar la base de datos de los datos ingresados por el cliente 
router.patch('/semillero/:semillero_id',update_semillero)
// router.patch es para actualizar un registro que se desea actualizar en la base de datos
router.delete('/semillero/:semillero_id',delete_semillero)
// router.delete es para eliminar mediante la llave primaria  un registro que ya no quiere que aparesca en obtener los datos de get
router.get('/semillero/:semillero_id',get_semillero_id)
// router.get se obtine los datos infiltrado los datos llamando por el id 
export default router
// para que todos los crud anterior mente creador para su correcto funcionarmiento en el frontend