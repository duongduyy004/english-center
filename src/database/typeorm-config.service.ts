import { AllConfigType } from "@/config/config.type";
import { AuditSubscriber } from "subscribers/audit-log.subscriber";
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
            database: this.configService.get('database.dbName', { infer: true }),
            entities: [__dirname + '/../**/*.entity{.js,.ts}'],
            subscribers: [AuditSubscriber],
            synchronize: true,
            ssl: false,
            extra: {
                channel_binding: this.configService.get('database.channelBinding', { infer: true }) || 'require',
                timezone: this.configService.get('app.timeZone', { infer: true })
            },
        } as TypeOrmModuleOptions;
    }
}