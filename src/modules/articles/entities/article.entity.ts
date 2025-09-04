import { MenuEntity } from "@/modules/menus/entities/menu.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('article')
export class ArticleEnity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column()
    menuId: string;

    @Column()
    file: string;

    @Column()
    publicId: string;

    @OneToOne(() => MenuEntity, { eager: true })
    @JoinColumn({ name: 'menuId' })
    menu: MenuEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
