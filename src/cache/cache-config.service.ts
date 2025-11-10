import { createKeyv } from "@keyv/redis";
import { CacheOptions, CacheOptionsFactory } from "@nestjs/cache-manager";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "config/config.type";

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
    constructor(
        private readonly configService: ConfigService<AllConfigType>
    ) { }
    createCacheOptions(): CacheOptions<Record<string, any>> | Promise<CacheOptions<Record<string, any>>> {
        const redis_host = this.configService.get('redis.host', { infer: true });
        const redis_username = this.configService.get('redis.username', { infer: true });
        const redis_password = this.configService.get('redis.password', { infer: true });
        const redis_port = this.configService.get('redis.port', { infer: true });
        const namespace = this.configService.get('app.name', { infer: true })

        return {
            ttl: this.configService.get('app.cacheTTL', { infer: true }),
            stores: [
                createKeyv(`redis://${redis_username}:${redis_password}@${redis_host}:${redis_port}`, {
                    namespace
                })
            ]
        }
    }
}