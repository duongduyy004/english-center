import { AllConfigType } from "@/config/config.type";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService<AllConfigType>) { }
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: this.configService.get('database.type', { infer: true }),
            host: this.configService.get('database.host', { infer: true }),
            port: this.configService.get('database.port', { infer: true }),
            username: this.configService.get('database.username', { infer: true }),
            password: this.configService.get('database.password', { infer: true }),
            database: this.configService.get('database.dbName', { infer: true })
        } as TypeOrmModuleOptions;
    }
}