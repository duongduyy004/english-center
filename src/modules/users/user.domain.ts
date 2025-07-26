import { Exclude } from "class-transformer";

export class User {
    id: number | string;

    name: string;

    email: string | null

    @Exclude({ toPlainOnly: true })
    password?: string

    gender: string;

    dayOfBirth: Date;

    address: string;

    phone: string;

    avatar?: string;

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date;
}