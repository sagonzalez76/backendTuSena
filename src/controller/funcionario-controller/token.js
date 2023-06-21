import jwt from "jsonwebtoken"
//import { funcionario } from "../../models/funcionario-models/funcionario-models"
import * as dotenv from 'dotenv'
dotenv.config()
class Token{
    sing=(object)=>{
    const token=jwt.sign(
        object,process.env.PASSWORDTOKEN,
        { expiresIn: "1h" }
        )
    return token
    }
    jsonlogin =()=>{
        const usertoken={
     id:funcionario.funcionario_id,
     usuario:funcionario.funcionario_iden,
     contrasena: funcionario.funcionario_contrasena
        }
       return usertoken
       
    }
}
export default Token