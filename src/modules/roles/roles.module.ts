import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from '@/modules/permissions/entities/permission.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity])],
    controllers: [RolesController],
    providers: [RolesService, RolesRepository],
    exports: [RolesService, RolesRepository]
})
export class RolesModule { }
