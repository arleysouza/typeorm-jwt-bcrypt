import { Router } from "express"
import UsuarioController from "../controllers/UsuarioController"
import {authAdmin} from '../middlewares'
const routes = Router()

routes.get('/', UsuarioController.list)
routes.post('/', authAdmin, UsuarioController.create)
routes.put('/', authAdmin, UsuarioController.update)
routes.delete('/', authAdmin, UsuarioController.delete)

export default routes