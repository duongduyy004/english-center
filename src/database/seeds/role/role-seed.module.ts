import { RoleEntity } from '@/modules/roles/entities/role.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSeedService } from './role-seed.service';


@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity])],
    providers: [RoleSeedService],
    exports: [RoleSeedService],
})
export class RoleSeedModule { }
