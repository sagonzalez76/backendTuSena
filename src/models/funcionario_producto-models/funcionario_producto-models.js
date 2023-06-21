import { sequelize } from "../../db/db.js";
import { DataTypes } from "sequelize";
import {funcionario} from "../funcionario-models/funcionario-models.js"
import {producto} from "../productos-models/productos-models.js"


export const funcionario_producto = sequelize.define('funcionario_producto',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
        
    },
    producto_fk:{
        type:DataTypes.INTEGER,
        allowNull: false,

    },
    funcionario_fk:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
    }

},
{
    timestamps:false
}
,
{ sequelize, modelName: 'funcionario_producto' })


funcionario.belongsToMany(producto, {
    through: 'funcionario_producto',
    foreignKey: 'funcionario_fk',
  });
  
  producto.belongsToMany(funcionario, {
    through: 'funcionario_producto',
    foreignKey: 'producto_fk',
  });
  