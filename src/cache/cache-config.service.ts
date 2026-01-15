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
        const namespace = this.configService.get('app.name', { infer: true })

        return {
            ttl: this.configService.get('app.cacheTTL', { infer: true }),
            namespace
        }
    }
}