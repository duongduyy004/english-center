import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '@/modules/permissions/entities/permission.entity';
import { permission_data } from './permission.data';

@Injectable()
export class PermissionSeedService {
    constructor(
        @InjectRepository(PermissionEntity)
        private repository: Repository<PermissionEntity>,
    ) { }

    async run() {
        const exists = await this.repository.count({});
        if (exists) return;
        const data: PermissionEntity[] = [];
        for (const [key, value] of Object.entries(permission_data)) {
            value.map(item => {
                data.push(this.repository.create({
                    module: key,
                    method: item.method,
                    path: item.path,
                    description: item.description
                }))
            })
        }
        await this.repository.save(data);
    }
}

