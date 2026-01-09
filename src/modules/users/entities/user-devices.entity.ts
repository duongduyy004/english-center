import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm"

@Entity('user_devices')
export class UserDevicesEntity {

    @PrimaryColumn()
    userId: string

    @PrimaryColumn()
    expoPushToken: string

    @Column()
    platform: string

    @Column({ default: true })
    isActive: boolean

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date
}