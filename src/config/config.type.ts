import { DatabaseConfig } from "./types/database-config.type"
import { AppConfig } from "./types/app-config.type"
import { JwtConfig } from "./types/jwt-config.type"
import { RedisConfig } from "./types/redis-config.type"
import { AwsConfig } from "./types/aws-config.type"
import { MinioConfig } from "./types/minio-config.type"

export type AllConfigType = {
    app: AppConfig
    database: DatabaseConfig,
    jwt: JwtConfig,
    redis: RedisConfig,
    aws: AwsConfig,
    minio: MinioConfig
}