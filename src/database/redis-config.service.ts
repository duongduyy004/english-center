import { AllConfigType } from "@/config/config.type";
import { BullRootModuleOptions, SharedBullConfigurationFactory } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisConfigService implements SharedBullConfigurationFactory {
    constructor(private readonly configService: ConfigService<AllConfigType>) { }
    createSharedConfiguration(): Promise<BullRootModuleOptions> | BullRootModuleOptions {
        return {
            connection: {
                host: this.configService.get('redis.host', { infer: true }),
                port: this.configService.get('redis.port', { infer: true }),
                username: this.configService.get('redis.username', { infer: true }),
                password: this.configService.get('redis.password', { infer: true })
            }
        }
    }
}