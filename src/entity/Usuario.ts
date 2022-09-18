import { AfterInsert, Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, AfterLoad } from "typeorm"
import * as bcrypt from "bcrypt"

export type Perfil = "user" | "admin"

@Entity({ name: "usuarios" })
export class Usuario {
    @PrimaryGeneratedColumn()
    idusuario: number

    @Column({ nullable: false, unique: true })
    re: number

    @Column({ length: 50, nullable: false })
    nome: string

    @Column({ nullable: false, select: false })
    senha: string

    @Column({type:'enum', enum:['user','admin'], default:'user', nullable:false})
    perfil: Perfil

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword(): void {
        if (this.senha) {
            this.senha = bcrypt.hashSync(this.senha, bcrypt.genSaltSync(10))
        }
    }

    compare(senha: string): Promise<boolean> {
        return bcrypt.compare(senha, this.senha)
    }
}
