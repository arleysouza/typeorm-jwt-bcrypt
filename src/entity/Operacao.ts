import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export type Ativa = "public" | "privete"

@Entity({name:"operacoes"})
export class Operacao {
    @PrimaryGeneratedColumn()
    idoperacao: number

    @Column({nullable: false, unique:true})
    nome: string

    @Column({nullable: false, default: false})
    ativa: boolean
}
