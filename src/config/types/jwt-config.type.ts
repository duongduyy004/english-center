export type JwtConfig = {
    jwt_secret?: string;
    jwt_access_expiration_minutes?: string;
    jwt_refresh_expiration_days?: string;
    jwt_reset_password_expiration_minutes?: string;
    jwt_verify_email_expiration_minutes?: string;
};
