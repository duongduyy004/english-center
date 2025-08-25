import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne } from "typeorm";
import * as bcrypt from "bcrypt";
import { RoleEntity } from "@/modules/roles/entities/role.entity";

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;
  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Column()
  gender: string;
  @Column()
  gender: string;

  @Column()
  dayOfBirth: Date;
  @Column()
  dayOfBirth: Date;

  @Column()
  address: string;
  @Column()
  address: string;

  @Column()
  phone: string;
  @Column()
  phone: string;

  @Column({ nullable: true })
  avatar?: string;
  @Column({ nullable: true })
  avatar?: string;

  @ManyToOne(() => RoleEntity, { eager: true })
  role: RoleEntity;
  @ManyToOne(() => RoleEntity, { eager: true })
  role: RoleEntity;

  @Column({ nullable: true })
  refreshToken: string;
  @Column({ nullable: true })
  refreshToken: string;

  @Column({ default: false })
  isEmailVerified: boolean

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
