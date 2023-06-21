import { sequelize } from "../../db/db.js";
// se importa la base de datos la cual la funcion es que se guarde los modelos que creamos en la base de datos
import { DataTypes } from "sequelize";
// importamos los tipos de datos de la libreria de sequelize

export const producto = sequelize.define('producto',{
    producto_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    producto_titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    producto_ano: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    producto_tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    producto_subtipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    producto_url: {
      type: DataTypes.STRING,
    },
    producto_imagen: {
      type: DataTypes.TEXT, 
      allowNull: true,
    },

    // BLOB("long"),
    // productos_autor: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },

    // No va por la relacion muchos a muchos entre productos e investigadores////

    proyecto_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,

      references: {
        model: "proyecto",
        key: "proyecto_id",
      },
    },
    semillero_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "semilleros",
        key: "semillero_id",
      },
    },
    // estos datos son los atributos que se diagramo en el modelo uml
  },
  {
    timestamps: false,
  },
  {
    sequelize,
    modelName: 'producto',
    tableName: 'producto'
  }
  // se define sequelize con modelname poniendole el nombre de la tabla
);
