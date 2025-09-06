import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '@/modules/permissions/entities/permission.entity';
import { PermissionSeedService } from './permission-seed.service';

@Module({
    imports: [TypeOrmModule.forFeature([PermissionEntity])],
    providers: [PermissionSeedService],
    exports: [PermissionSeedService]
})
export class PermissionSeedModule { }
