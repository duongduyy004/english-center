import { DatabaseConfig } from "@/config/types/database-config.type"
import { AppConfig } from "@/config/types/app-config.type"
import { JwtConfig } from "@/config/types/jwt-config.type"

export type AllConfigType = {
    app: AppConfig
    database: DatabaseConfig,
    jwt: JwtConfig
}