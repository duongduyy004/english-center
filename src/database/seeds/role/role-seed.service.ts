import { RoleEntity } from '@/modules/roles/entities/role.entity';
import { RoleEnum } from '@/modules/roles/roles.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
    constructor(
        @InjectRepository(RoleEntity)
        private repository: Repository<RoleEntity>,
    ) { }

    async run() {
        const countAdmin = await this.repository.count({
            where: {
                id: RoleEnum.admin,
            },
        });

        if (!countAdmin) {
            await this.repository.save(
                this.repository.create({
                    id: RoleEnum.admin,
                    name: 'Admin',
                }),
            );
        }

        const countTeacher = await this.repository.count({
            where: {
                id: RoleEnum.teacher,
            },
        });

        if (!countTeacher) {
            await this.repository.save(
                this.repository.create({
                    id: RoleEnum.teacher,
                    name: 'Teacher',
                }),
            );
        }
        const countParent = await this.repository.count({
            where: {
                id: RoleEnum.parent,
            },
        });

        if (!countParent) {
            await this.repository.save(
                this.repository.create({
                    id: RoleEnum.parent,
                    name: 'Parent',
                }),
            );
        }

        const countStudent = await this.repository.count({
            where: {
                id: RoleEnum.student,
            },
        });

        if (!countStudent) {
            await this.repository.save(
                this.repository.create({
                    id: RoleEnum.student,
                    name: 'Student',
                }),
            );
        }
    }
}
