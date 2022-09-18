import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
dotenv.config()

// cria um token usando os dados do usuário
export const generateToken = async usuario => jwt.sign(usuario, process.env.JWT_SECRET);

// verifica se o usuário possui autorização
export const authorization = async (req: Request, res: Response, next: NextFunction) => {
    // o token precisa ser enviado pelo cliente no header da requisição
    const authorization = req.headers.authorization
    try {
        // autorização no formato Bearer token
        const [,token] = authorization.split(" ")
        // valida o token
        const decoded = <any>jwt.verify(token, process.env.JWT_SECRET);
        if( !decoded || !decoded.idusuario ){
            res.status(401).send({error:"Não autorizado"});
        }
    } catch (error) {
        // o toke não é válido, a resposta com HTTP Method 401 (unauthorized)
        res.status(401).send({error:"Não autorizado"});
        return;
    }
    return next();
};

// requer a autorização de admin para acessar o recurso
export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // o token precisa ser enviado pelo cliente no header da requisição
    const authorization = req.headers.authorization
    try {
        // autorização no formato Bearer token
        const [,token] = authorization.split(" ")
        // valida o token
        const decoded = <any>jwt.verify(token, process.env.JWT_SECRET);
        if( !decoded || decoded.perfil !== 'admin' ){
            res.status(401).send({error:"Sem autorização para acessar o recurso"});
            return;
        }
    } catch (error) {
        // o toke não é válido, a resposta com HTTP Method 401 (unauthorized)
        res.status(401).send({error:"Não autorizado"});
        return;
    }
    return next();
};



