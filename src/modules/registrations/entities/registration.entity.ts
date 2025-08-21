import { ClassEntity } from '@/modules/classes/entities/class.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('registration')
export class RegistrationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  name: string;
  @Column()
  phone: string;
  @Column({ enum: ['male', 'female'] })
  gender: string;
  @Column()
  address: string;
  @Column()
  note: string;
  @Column()
  processed: boolean;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
  })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)',
  })
  updatedAt: Date;
  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;

  @Column({ nullable: false })
  classId: string;

  @ManyToOne(() => ClassEntity)
  @JoinColumn({ name: 'classId' })
  class?: ClassEntity;
}
