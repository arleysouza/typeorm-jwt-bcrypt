import { Router } from "express"
import EscalaController from "../controllers/EscalaController"
import {authAdmin} from '../middlewares'

const routes = Router()

routes.get('/', EscalaController.listByOperacao)
routes.post('/', authAdmin, EscalaController.create)
routes.put('/', authAdmin, EscalaController.update)
routes.delete('/', authAdmin, EscalaController.delete)

export default routes