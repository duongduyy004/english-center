export type JwtConfig = {
    jwt_access_secret: string;
    jwt_access_expiration_minutes?: string;
    jwt_refresh_secret?: string;
    jwt_refresh_expiration_days?: string;
};
