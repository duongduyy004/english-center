import { Allow } from 'class-validator';

export class Role {
    @Allow()
    id: number;

    @Allow()
    name?: string;
}
