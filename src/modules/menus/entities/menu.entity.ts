import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from "typeorm";

@Entity('menus')
@Tree('closure-table')
export class MenuEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    slug: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    order: number;

    @Column({ default: true })
    isActive: boolean;

    @TreeChildren({ cascade: true })
    childrenMenu: MenuEntity[];

    @TreeParent({ onDelete: 'RESTRICT' })
    parentMenu: MenuEntity;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamptz" })
    deletedAt?: Date;
}
