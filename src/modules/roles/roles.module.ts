import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from '@/modules/permissions/entities/permission.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';
import { PermissionCacheService } from './permission-cache.service';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity])],
    controllers: [RolesController],
    providers: [RolesService, RolesRepository, PermissionCacheService],
    exports: [RolesService, RolesRepository, PermissionCacheService]
})
export class RolesModule { }

