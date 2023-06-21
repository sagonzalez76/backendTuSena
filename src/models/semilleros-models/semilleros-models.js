import { sequelize } from "../../db/db.js";
import { DataTypes } from "sequelize";


export const semilleros=sequelize.define('semilleros',{
    semillero_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    semillero_nombre: {
        type: DataTypes.STRING,
        allowNull: false

    },
   
},
{ sequelize, modelName: 'semilleros' },
)
