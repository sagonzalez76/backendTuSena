
export default{
    SECRET: 'funcionario',
}

import {config} from 'dotenv'

config()


export const PORT = process.env.PORT || 3000
// export const DB_USER = process.env.DB_USER
// export const DB_PASSWORD = process.env.DB_PASSWORD 
// export const DB_DATABASE = process.env.DB_DATABASE 
// export const NODE_ENV = process.env.NODE_ENV
// export const DB_HOST = process.env.DB_HOST

// export const LOCAL_DB_DATABASE = process.env.LOCAL_DB_DATABASE
// export const LOCAL_DB_USER = process.env.LOCAL_DB_USER
// export const LOCAL_DB_PASSWORD = process.env.LOCAL_DB_PASSWORD
// export const LOCAL_DB_HOST = process.env.LOCAL_DB_HOST
// export const LOCAL_DB_PORT = process.env.LOCAL_DB_PORT

// // console.log(DB_HOST)