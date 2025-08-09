import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { RoleSeedModule } from './role/role-seed.module';
import databaseConfig from '@/config/configs/database.config';
import appConfig from '@/config/configs/app.config';
import { TypeOrmConfigService } from '../typeorm-config.service';

@Module({
    imports: [
        RoleSeedModule,
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
