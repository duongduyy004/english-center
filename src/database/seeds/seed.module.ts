import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { RoleSeedModule } from './role/role-seed.module';
import { AdminUserSeedModule } from './admin/admin-user-seed.module';
import databaseConfig from '@/config/configs/database.config';
import appConfig from '@/config/configs/app.config';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { ClassSeedModule } from './class/class-seed.module';
import { StudentSeedModule } from './student/student-seed.module';
import { TeacherSeedModule } from './teacher/teacher-seed.module';
import { ParentSeedModule } from './parent/parent-seed.module';

@Module({
    imports: [
        RoleSeedModule,
        AdminUserSeedModule,
        ClassSeedModule,
        StudentSeedModule,
        TeacherSeedModule,
        ParentSeedModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, appConfig],
            envFilePath: ['.env'],
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
            dataSourceFactory: async (options: DataSourceOptions) => {
                return new DataSource(options).initialize();
            },
        }),
    ],
})
export class SeedModule { }
