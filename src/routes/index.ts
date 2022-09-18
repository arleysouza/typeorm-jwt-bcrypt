import { Router, Request, Response } from "express"
import usuario from './usuario'
import operacao from './operacao'
import escala from './escala'
import {authorization} from '../middlewares'
import UsuarioController from "../controllers/UsuarioController"

const routes = Router()

routes.use("/usuario", authorization, usuario)
routes.use("/operacao", authorization, operacao)
routes.use("/escala", authorization, escala)
routes.post("/login", UsuarioController.login)

//aceita qualquer método HTTP ou URL
routes.use( (req:Request,res:Response) => res.json({error:"Requisição desconhecida"}) )

export default routes
