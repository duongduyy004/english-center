import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('footer_settings')
export class FooterSettingsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 'default' })
    key: string; // Singleton pattern - chỉ có 1 record với key = 'default'

    @Column()
    companyName: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    facebookUrl: string;

    @Column({ nullable: true })
    youtubeUrl: string;

    @Column({ nullable: true })
    zaloUrl: string;

    @Column({ type: 'text', nullable: true })
    mapEmbedUrl: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;
}

