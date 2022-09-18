import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, TreeRepository } from "typeorm"
import { Operacao } from "./Operacao"

export type Tipo = "café" | "intervalo"

@Entity({
    name:"escalas"
})
export class Escala {
    @PrimaryGeneratedColumn()
    idescala: string

    @ManyToOne((type) => Operacao, { onDelete: 'CASCADE' })
    @JoinColumn({  //Defines which side of the relation contains the join column with a foreign key 
        name: "idoperacao",
        referencedColumnName: "idoperacao",
        foreignKeyConstraintName: "fk_operacao_id"
    })
    operacao: Operacao

    @Column({nullable:false})
    inicio: number

    @Column({nullable:false})
    fim: number

    @Column({nullable:false})
    cabine: number

    @Column({type:'enum', enum:['café','intervalo'], default:'café', nullable:false})
    tipo: Tipo
}