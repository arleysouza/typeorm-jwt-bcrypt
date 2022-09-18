import { AppDataSource } from "../app-data-source"
import { Request, Response } from 'express'
import { Operacao } from '../entity/Operacao'

class OperacaoController {

    public async create(req: Request, res: Response): Promise<Response> {
        const { nome } = req.body
        const operacao = await AppDataSource.manager.save(Operacao, { nome }).catch((e) => {
            // testa se o nome é repetido
            if (/(nome)[\s\S]+(already exists)/.test(e.detail)) {
                return { error: 'Operação já existe' }
            }
            return { error: e.message }
        })
        return res.json(operacao)
    }

    // atualiza somente o nome
    public async update(req: Request, res: Response): Promise<Response> {
        const { idoperacao, nome } = req.body
        if (!idoperacao) {
            return res.json({ error: "Identificador inválido" })
        }
        const operacao: any = await AppDataSource.manager.findOneBy(Operacao, { idoperacao }).catch((e) => {
            return { error: e.message }
        })
        if (operacao && operacao.idoperacao) {
            operacao.nome = nome
            const r = await AppDataSource.manager.save(Operacao, operacao).catch((e) => {
                // testa se o nome é repetido
                if (/(nome)[\s\S]+(already exists)/.test(e.detail)) {
                    return ({ error: 'Operação já existe' })
                }
                return e
            })
            return res.json(r)
        }
        else if (operacao && operacao.error) {
            return res.json(operacao)
        }
        else {
            return res.json({ error: "Operação não localizada" })
        }
    }

    // torna a operação ativa e desativa qualquer outra que esteja ativa,
    // pois poderá ter apenas uma operação ativa
    public async active(req: Request, res: Response): Promise<Response> {
        const { idoperacao } = req.body
        if (!idoperacao) {
            return res.json({ error: "Identificador inválido" })
        }
        const operacao: any = await AppDataSource.manager.findOneBy(Operacao, { idoperacao }).catch((e) => {
            return { error: e.message }
        })

        if (operacao && operacao.idoperacao) {
            //antes de setar para true iremos alterar todas as outras para false
            const update = await AppDataSource
                .createQueryBuilder()
                .update(Operacao)
                .set({ ativa: false })
                .where("ativa=:ativa", { ativa: true })
                .execute()

            operacao.ativa = true
            const r = await AppDataSource.manager.save(Operacao, operacao).catch((e) => {
                return { error: e.message }
            })
            return res.json(r)
        }
        else {
            return res.json({ error: "Operação não localizada" })
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { idoperacao } = req.body
        if (!idoperacao) {
            return res.json({ error: "Identificador inválido" })
        }
        const operacao: any = await AppDataSource.manager.findOneBy(Operacao, { idoperacao }).catch((e) => {
            return { error: e.message }
        })

        if (operacao && operacao.idoperacao) {
            const r = await AppDataSource.manager.remove(Operacao, operacao).catch((e) => e.message)
            return res.json(r)
        }
        else if (operacao && operacao.error) {
            return res.json(operacao)
        }
        else {
            return res.json({ error: "Operação não localizada" })
        }
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const operacoes = await AppDataSource.manager.find(Operacao).catch((e) => {
            return { error: e.message }
        })

        return res.json(operacoes)
    }
}

export default new OperacaoController()