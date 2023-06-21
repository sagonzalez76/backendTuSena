import { programas } from "../../models/programa-models/programa-models.js";

export const programa = async (req,res)=>{
    try {
        const nuevo_programa = await programas.findAll();
         res
        .status(200)
        .json({ message: "se creo el obtuvo correctamente", nuevo_programa });
    } catch (error) {
        return res.status(400).json({message:error.message})
        
    }
}


export const create_programa = async (req, res) => {
    const {
      programa_nombre,
    } = req.body;
  console.log(programa_nombre)
    try {
      const nuevo_programa = await programas.create({
        programa_nombre
      });
      res
        .status(200)
        .json({ message: "se creo el programa correctamente", nuevo_programa });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
  
  
  
export const update_programa = async (req, res) => {
    try {
      const { programa_id } = req.params;
      const {
        programa_nombre
      } = req.body;
  
      const programa = await programas.findByPk(programa_id);
     programa.programa_nombre=programa_nombre
     await programa.save();
     
     res.status(201).json({
        message: "se ha actualizado el programa",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

  
export const delete_programa = async (req, res) => {
    try {
      const { programa_id } = req.params;
      await programas.destroy({
        where: {
            programa_id,
        },
      });
      // res.sendStatus(204)
      // api.setEstado("success", "success", "se ah creado exitosamente la especie")
      // res.json("eliminado")
      res
        .status(200)
        .json({ message: "programa eliminado correctamente", programa_id });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  


  
export const get_programa_id = async (req, res) => {
    const { programa_id } = req.params;
    try {
      const nuevo_programa = await programas.findOne({
        where: { programa_id },
      });
      res.status(200).json({ message: "Programa obtenido por id", nuevo_programa });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  
