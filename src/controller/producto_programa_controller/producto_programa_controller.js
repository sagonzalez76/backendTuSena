import { producto_programa } from "../../models/producto_programa/producto_programa_models.js";

export const productos_programas = async (req,res)=>{
    try {
        const productos_programas = await producto_programa .findAll()
        res.status(200).json({succes:true, message:'listado',productos_programas})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}