import { sequelize } from "../../db/db.js";
import { DataTypes } from "sequelize";

export const proyecto = sequelize.define('proyecto', {
    proyecto_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    proyecto_codigo: {
        type: DataTypes.STRING,
        allowNull: false

    },
    proyecto_linea: {
        type: DataTypes.STRING,
        allowNull: false
    },
    proyecto_nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    proyecto_presupuesto: {
        type: DataTypes.INTEGER(20),
        allowNull: false

    },

},

    {
        sequelize, 
        modelName: 'proyecto',
        tableName: 'proyecto',
    }
)



