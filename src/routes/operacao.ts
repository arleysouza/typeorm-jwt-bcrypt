import { Router } from "express"
import OperacaoController from "../controllers/OperacaoController"
import {authAdmin} from '../middlewares'

const routes = Router()

routes.get('/', OperacaoController.list)
routes.post('/', authAdmin, OperacaoController.create)
routes.put('/active', authAdmin, OperacaoController.active)
routes.put('/', authAdmin, OperacaoController.update)
routes.delete('/', authAdmin, OperacaoController.delete)

export default routes