import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('registration')
export class RegistrationEnity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}
