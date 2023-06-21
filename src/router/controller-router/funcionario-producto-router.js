import  {Router} from "express";

import {funcionario_productos} from "../../controller/funcionario_producto-controller/funcionario_producto-controller.js";

const router = Router()

router.get('/funcionario_producto',funcionario_productos)



export default router

