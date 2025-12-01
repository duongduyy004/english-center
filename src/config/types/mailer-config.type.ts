export type MailerConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
    ignoreTls: boolean;
    secure: boolean;
    requireTls: boolean;
    defaultEmail: string;
    defaultName: string;
    clientPort: number;
}