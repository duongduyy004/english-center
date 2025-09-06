import { Allow } from 'class-validator';

export class Permission {

    id: number;

    path: string;

    method: string;

    description: string;

    module: string;

    version: number;

    createdAt: Date;

    updatedAt: Date;
}
