import { Allow } from 'class-validator';
import { Permission } from 'modules/permissions/permission.domain';

export class Role {
    @Allow()
    id: number;

    @Allow()
    name?: string;

    permissions?: Partial<Permission>[]
}
