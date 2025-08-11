import { Exclude } from "class-transformer";
import { Role } from "modules/roles/role.domain";

export class User {
    id: string;

    name: string;

    email: string | null

    @Exclude({ toPlainOnly: true })
    password?: string

    gender: string;

    dayOfBirth: Date;

    address: string;

    phone: string;

    avatar?: string;

    role: Role;

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date;
}