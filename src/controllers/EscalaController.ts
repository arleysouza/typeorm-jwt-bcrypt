import { AppDataSource } from "../app-data-source"
import { Request, Response } from 'express'
import { Escala } from '../entity/Escala'
import { Operacao } from "../entity/Operacao"

class EscalaController {
    public async create(req: Request, res: Response): Promise<Response> {
        const { idoperacao, inicio, fim, cabine, tipo } = req.body
        if (!idoperacao) {
            return res.json({ error: "Identificador inválido" })
        }
        const operacao: any = await AppDataSource.manager.findOneBy(Operacao, { idoperacao }).catch((e) => {
            return { error: "Identificador inválido da operacação" }
        })

        if (operacao && operacao.idoperacao) {
            const escala = new Escala()
            escala.inicio = inicio
            escala.fim = fim
            escala.cabine = cabine
            escala.tipo = tipo
            escala.operacao = operacao
            const r = await AppDataSource.manager.save(Escala, escala).catch((e) => {
                return { error: e.message }
            })
            return res.json(r)
        }
        else if (!operacao) {
            return res.json({ error: "Operação não identificada" })
        }
        else {
            return res.json(operacao)
        }
    }

    // só não pode mudar a operação
    public async update(req: Request, res: Response): Promise<Response> {
        let { idescala, inicio, fim, cabine, tipo } = req.body
        if (!idescala) {
            return res.json({ error: "Identificador inválido" })
        }
        const escala: any = await AppDataSource.manager.findOneBy(Escala, { idescala }).catch((e) => {
            return { error: e.message }
        })
        
        if (escala && escala.idescala) {
            escala.inicio = inicio
            escala.fim = fim
            escala.cabine = cabine
            escala.tipo = tipo
            const r = await AppDataSource.manager.save(Escala, escala).catch((e) => {
                return { error: e.message }
            })
            return res.json(r)
        }
        else if (escala && escala.error) {
            return res.json(escala)
        }
        else {
            return res.json({ error: "Escala não localizada" })
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { idescala } = req.body
        if (!idescala) {
            return res.json({ error: "Identificador inválido" })
        }
        const escala: any = await AppDataSource.manager.findOneBy(Escala, { idescala }).catch((e) => {
            return { error: e.message }
        })

        if (escala && escala.idescala) {
            const r = await AppDataSource.manager.remove(Escala, escala).catch((e) => e.message)
            return res.json(r)
        }
        else if (escala && escala.error) {
            return res.json(escala)
        }
        else {
            return res.json({ error: "Escala não localizada" })
        }
    }

    public async listByOperacao(req: Request, res: Response): Promise<Response> {
        const { idoperacao } = req.body
        const escalas = await AppDataSource
            .getRepository(Escala)
            .createQueryBuilder('escalas')
            .innerJoin(Operacao, "operacoes", "operacoes.idoperacao=escalas.idoperacao")
            .select()
            .where("operacoes.idoperacao=:idoperacao", { idoperacao })
            .orderBy({ inicio: "ASC" })
            .getMany()
        return res.json(escalas)
    }
}

export default new EscalaController()