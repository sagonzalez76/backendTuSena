import { funcionario_producto } from "../../models/funcionario_producto-models/funcionario_producto-models.js";

export const funcionario_productos = async (req, res) => {
    try {
        const funcionario_productos = await funcionario_producto.findAll()
        res.status(200).json({ succes: true, message: 'listado', funcionario_productos })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}