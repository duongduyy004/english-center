import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserSeedService } from './admin-user-seed.service';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { RoleEntity } from '@/modules/roles/entities/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
    providers: [AdminUserSeedService],
    exports: [AdminUserSeedService],
})
export class AdminUserSeedModule { }
