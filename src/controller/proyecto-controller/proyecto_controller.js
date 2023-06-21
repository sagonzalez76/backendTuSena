
import { proyecto } from "../../models/proyecto-models/proyecto-models.js"

export const get_proyecto = async (req, res) => {

    try {
        const nuevo_proyecto = await proyecto.findAll()
        res.status(200).json({ message: "Listado de los proyectos", nuevo_proyecto })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const create_proyecto = async (req, res) => {
    try {
        const { proyecto_codigo, proyecto_linea, proyecto_nombre, proyecto_presupuesto } = req.body;
        const nuevo_proyecto = await proyecto.create({
            proyecto_codigo,
            proyecto_linea,
            proyecto_nombre,
            proyecto_presupuesto
        })
        res.status(200).json({ message: "Proyecto creado", nuevo_proyecto })

    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
}

export const update_proyecto = async (req, res) => {
    try {
        const { proyecto_id } = req.params

        const { proyecto_codigo,
            proyecto_linea,
            proyecto_nombre,
            proyecto_presupuesto } = req.body

        const nuevo_proyecto = await proyecto.findByPk(proyecto_id)

        nuevo_proyecto.proyecto_codigo = proyecto_codigo,
        nuevo_proyecto.proyecto_linea = proyecto_linea,
        nuevo_proyecto.proyecto_nombre = proyecto_nombre,
        nuevo_proyecto.proyecto_presupuesto = proyecto_presupuesto

        await nuevo_proyecto.save()
        return res.status(200).json({ message: "se ha actualizado el Proyecto", nuevo_proyecto })


    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
}


export const delete_proyecto = async (req, res) => {
    try {
        const { proyecto_id } = req.params
        await proyecto.destroy({
            where: {
                proyecto_id
            }
        })
        res.status(200).json({ message: "Proyecto eliminado correctamente" })
    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
}


export const get_proyecto_id = async (req, res) => {
    const { proyecto_id } = req.params
    try {
        const nuevo_proyecto = await proyecto.findOne({
            where: { proyecto_id },
        })
        res.status(200).json({ message: "Proyecto obtenido por id", nuevo_proyecto })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }


}