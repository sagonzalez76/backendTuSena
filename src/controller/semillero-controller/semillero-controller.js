import { semilleros } from "../../models/semilleros-models/semilleros-models.js";

export const get_semillero = async (req,res)=>{
    try {
        const nuevo_semillero = await semilleros.findAll()
        res.status(200).json({message:"Listado de los semilleros",nuevo_semillero})
    } catch (error) {
        return res.status(400).json({message:error.message})
        
    }
}

export const get_semillero_id = async (req,res) =>{
    const { semillero_id } = req.params
    try {
        const nuevo_semillero = await semilleros.findOne({
            where: { semillero_id },      
        })
        res.status(200).json({message:"Semillero obtenido por id",nuevo_semillero})

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const create_semillero = async (req,res)=>{
    const {semillero_nombre} = req.body
    console.log()
    try {
        const nuevo_semillero = await semilleros.create({
            semillero_nombre
        })
        res.status(200).json({message:"item creado",nuevo_semillero})
    } catch (error) {
        return res.status(400).json({message:error.message})
        
    }
}

export const update_semillero = async (req,res)=>{
    try {
        const {semillero_id} = req.params;
        const {semillero_nombre} = req.body
        const nuevo_semillero = await semilleros.findByPk(semillero_id)
        nuevo_semillero.semillero_nombre=semillero_nombre
        await nuevo_semillero.save()
        return res.status(200).json({message: "se ha actualizado el Semillero", nuevo_semillero})

    } catch (error) {
        return res.status(500).json({ message: error.message })
        
    }
}

export const delete_semillero = async (req,res) =>{
    try {
        const {semillero_id} = req.params;
        const nuevo_semillero = await semilleros.destroy({
            where:{
                semillero_id
            }
        })
        res.status(200).json({message:'Semillero eliminado satisfactoriamente',nuevo_semillero})

    } catch (error) {
        return res.status(500).json({ message: error.message })
        
    }
}