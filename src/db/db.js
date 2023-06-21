
import { timeStamp } from "console";
import {Sequelize} from "sequelize";

export const sequelize = new Sequelize(
   process.env.DB_DATABASE || 'final1',//nombre de la base de datos
   process.env.DB_USER || 'postgres',//usuario
    process.env.DB_PASSWORD || '0000',//contraseña de la base de datos
    {
        host:process.env.DB_HOST || 'localhost',      
        dialect: 'postgres',
      //   define:{
      //     timestamps: false,
      // },
        port:process.env.DB_PORT || 5432,
        pool: {
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        },
  timeStamp:false,

    })

