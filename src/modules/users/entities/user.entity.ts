import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, TableInheritance } from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password?: string;

    @Column()
    gender: string;

    @Column()
    dayOfBirth: Date;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column({ nullable: true })
    avatar: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(0)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(0)", onUpdate: "CURRENT_TIMESTAMP(0)" })
    updated_at: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
