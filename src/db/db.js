
// import { timeStamp } from "console";
// import { Sequelize } from "sequelize";

// export const sequelize = new Sequelize(
//   process.env.DB_DATABASE || 'tusena',//nombre de la base de datos
//   process.env.DB_USER || 'tusena',//usuario
//   process.env.DB_PASSWORD || 'mtqTFN0rcAHEAhfW93WHUGrstOm55SoN',//contraseña de la base de datos
//   {
//     host: process.env.DB_HOST || 'postgres://tusena:mtqTFN0rcAHEAhfW93WHUGrstOm55SoN@dpg-cnkc0ev79t8c73d194o0-a.oregon-postgres.render.com/tusena',
//     dialect: 'postgres',
//     //   define:{
//     //     timestamps: false,
//     // },
//     port: process.env.DB_PORT || 5432,
//     pool: {
//       max: 5,
//       min: 0,
//       require: 30000,
//       idle: 10000
//     },
//     timeStamp: false,

//   })

import Sequelize from "sequelize";

export const sequelize = new Sequelize(
  "tusena", // nombre de la base de datos,
  "tusena", // nombre de usuario
  "mtqTFN0rcAHEAhfW93WHUGrstOm55SoN", // contraseña
  {
    host: "dpg-cnkc0ev79t8c73d194o0-a.ohio-postgres.render.com", // nombre del host
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    // pool: {
    //   max: 5,
    //   min: 0,
    //   require: 30000,
    //   idle: 10000,
    // },
    logging: false,
  }
);
