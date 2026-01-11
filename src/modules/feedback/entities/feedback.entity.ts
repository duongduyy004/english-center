import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('feed_back')
export class FeedbackEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    imageUrl: string;

    @Column()
    publicId: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    socialUrl: string | null;

    @Column()
    name: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamptz" })
    deletedAt: Date;
}
