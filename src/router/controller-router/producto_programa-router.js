import  {Router} from "express";

import { productos_programas } from "../../controller/producto_programa_controller/producto_programa_controller.js";

const router = Router()

router.get('/producto_programa',productos_programas)

export default router
