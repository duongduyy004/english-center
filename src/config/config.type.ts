import { DatabaseConfig } from "./types/database-config.type"
import { AppConfig } from "./types/app-config.type"
import { JwtConfig } from "./types/jwt-config.type"
import { RedisConfig } from "./types/redis-config.type"
import { CloudinaryConfig } from "./types/cloudinary-config.type"
import { PaymentConfig } from "./types/payment-config.type"

export type AllConfigType = {
    app: AppConfig
    database: DatabaseConfig,
    jwt: JwtConfig,
    redis: RedisConfig,
    cloudinary: CloudinaryConfig,
    payment: PaymentConfig
}