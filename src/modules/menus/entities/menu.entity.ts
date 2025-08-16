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

    @TreeChildren({ cascade: true })
    children: MenuEntity[];

    @TreeParent({ onDelete: 'RESTRICT' })
    parent: MenuEntity;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(0)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(0)", onUpdate: "CURRENT_TIMESTAMP(0)" })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
