import { sequelize } from "../../db/db.js";
// se importa la base de datos la cual la funcion es que se guarde los modelos que creamos en la base de datos

import { DataTypes } from "sequelize";
// importamos los tipos de datos de la libreria de sequelize

export const funcionario = sequelize.define('funcionario', {
    // creamos una constate que se llame producto y la exportamos con export definimos el nombre de sequelize que es la conexion de la base de datos 
    funcionario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    funcionario_iden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    funcionario_nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    funcionario_apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    funcionario_correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    funcionario_recuperar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    funcionario_contrasena: {
        type: DataTypes.STRING,
        allowNull: false
    },
    funcionario_telefono: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    funcionario_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},

    {
        sequelize,
        tableName: 'funcionario',
        modelName: 'funcionario'
    },
    // se define sequelize con modelname poniendole el nombre de la tabla 

    {
        timestamps: false
    }

)
