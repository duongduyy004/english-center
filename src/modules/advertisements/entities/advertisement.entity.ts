import { ClassEntity } from "@/modules/classes/entities/class.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('advertisement')
export class AdvertisementEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({ enum: ['popup', 'banner'] })
    type: 'popup' | 'banner';

    @Column({ type: 'int', default: 0 })
    priority: number;

    @Column()
    imageUrl: string;

    @Column()
    publicId: string;

    @Column({ nullable: true })
    classId?: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleteAt: Date

    @ManyToOne(() => ClassEntity, { nullable: true })
    @JoinColumn({ name: 'classId' })
    class?: ClassEntity;
}
