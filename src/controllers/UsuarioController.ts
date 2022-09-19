import { AppDataSource } from "../app-data-source"
import { Request, Response } from 'express'
import { Usuario } from '../entity/Usuario'
import { generateToken } from '../middlewares'


class UsuarioController {
  public async login(req: Request, res: Response): Promise<Response> {
    const { re, senha } = req.body
    // como a propriedade senha não está disponível para select {select: false},
    // então precisamos usar esta conulta para forçar incluir a propriedade 
    const usuario: any = await AppDataSource
      .getRepository(Usuario)
      .createQueryBuilder("user")
      .select()
      .addSelect('user.senha')
      .where("user.re=:re", { re })
      .getOne()

    if (usuario && usuario.idusuario) {
      const r = await usuario.compare(senha)
      if (r) {
        const token = await generateToken({ idusuario: usuario.idusuario, perfil: usuario.perfil })
        return res.json({
          idusuario: usuario.idusuario,
          re: usuario.re,
          nome: usuario.nome,
          perfil: usuario.perfil,
          token
        })
      }
      return res.json({ error: "Dados de login não conferem" })
    }
    else {
      return res.json({ error: "Usuário não localizado" })
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { re, nome, senha, perfil } = req.body
    const obj = new Usuario()
    obj.re = re
    obj.nome = nome
    obj.senha = senha
    obj.perfil = perfil
    // o hook BeforeInsert não é disparado com AppDataSource.manager.save(Usuario,JSON),
    // mas é disparado com AppDataSource.manager.save(Usuario,objeto do tipo Usuario)
    // https://github.com/typeorm/typeorm/issues/5493
    const usuario = await AppDataSource.manager.save(Usuario, obj).catch((e) => {
      // testa se o re é repetido
      if (/(re)[\s\S]+(already exists)/.test(e.detail)) {
        return { error: 'RE já existe' }
      }
      return { error: e.message }
    })
    return res.json(usuario)
  }

  // usado pelo administrador para alterar qualquer dado
  public async update(req: Request, res: Response): Promise<Response> {
    const { idusuario, re, nome, perfil, senha } = req.body
    const usuario: any = await AppDataSource.manager.findOneBy(Usuario, { idusuario }).catch((e) => {
      return { error: "Identificador inválido" }
    })
    if (usuario && usuario.idusuario) {
      usuario.re = re
      usuario.nome = nome
      usuario.perfil = perfil
      if (senha !== "") {
        usuario.senha = senha
      }
      const r = await AppDataSource.manager.save(Usuario, usuario).catch((e) => {
        // testa se o RE é repetido
        if (/(re)[\s\S]+(already exists)/.test(e.detail)) {
          return ({ error: 'RE já existe' })
        }
        return e
      })
      return res.json(r)
    }
    else if (usuario && usuario.error) {
      return res.json(usuario)
    }
    else {
      return res.json({ error: "Usuário não localizado" })
    }
  }

  // usado pelo usuário para alterar somente a própria senha
  public async updateSenha(req: Request, res: Response): Promise<Response> {
    const { senha } = req.body
    const {idusuario} = res.locals
    const usuario: any = await AppDataSource.manager.findOneBy(Usuario, { idusuario }).catch((e) => {
      return { error: "Identificador inválido" }
    })
    if (usuario && usuario.idusuario) {
      usuario.senha = senha
      
      const r = await AppDataSource.manager.save(Usuario, usuario).catch((e) => {
        return ({ error: e.message })
      })
      return res.json(r)
    }
    else if (usuario && usuario.error) {
      return res.json(usuario)
    }
    else {
      return res.json({ error: "Usuário não localizado" })
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { idusuario } = req.body
    const usuario: any = await AppDataSource.manager.findOneBy(Usuario, { idusuario }).catch((e) => {
      return { error: "Usuário não existe no cadastro" }
    })

    if (usuario && usuario.idusuario) {
      const r = await AppDataSource.manager.remove(Usuario, usuario).catch((e) => e.message)
      return res.json(r)
    }
    else if (usuario && usuario.error) {
      return res.json(usuario)
    }
    else {
      return res.json({ error: "Usuário não localizado" })
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const usuarios = await AppDataSource.manager.find(Usuario, { order: { nome: "ASC" } }).catch((e) => {
      return { error: e.message }
    })

    return res.json(usuarios)
  }
}

export default new UsuarioController()