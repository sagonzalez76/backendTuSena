import  {Router} from "express";
import { create_proyecto, delete_proyecto, get_proyecto, get_proyecto_id, update_proyecto } from "../../controller/proyecto-controller/proyecto_controller.js";
const router = Router()

router.get('/proyecto',get_proyecto)
router.post('/proyecto',create_proyecto)
router.patch('/proyecto/:proyecto_id',update_proyecto)
router.delete('/proyecto/:proyecto_id',delete_proyecto)
router.get('/proyecto/:proyecto_id',get_proyecto_id)

export default router




