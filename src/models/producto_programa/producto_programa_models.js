import { sequelize } from "../../db/db.js";
import { DataTypes } from "sequelize";
import {producto} from "../productos-models/productos-models.js"
import{programas} from "../programa-models/programa-models.js"


export const producto_programa = sequelize.define('producto_programa', {
    producto_programa_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    programa_fk: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        foreignKey:true
    },
    productos_fk: {
        type:DataTypes.INTEGER,
        foreignKey:true
    } ,
},
    { sequelize,
        tableName:'producto_programa',
        modelName: 'producto_programa' },
)
programas.belongsToMany(producto, {
    through: 'producto_programa',
    foreignKey: 'programa_fk',
  });
  
  producto.belongsToMany(programas, {
    through: 'producto_programa',
    foreignKey: 'productos_fk',
  });