import { Allow } from 'class-validator';
import { Permission } from 'modules/permissions/permission.domain';

export class Role {
    @Allow()
    id: number;

    @Allow()
    name?: string;

    isActive: boolean;

    description: string;

    permissions?: Partial<Permission>[]
}
