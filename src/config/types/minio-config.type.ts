export type MinioConfig = {
    accessKey: string;
    secretKey: string;
    endpoint: string;
    port: number;
    useSSL: boolean;
    bucketName: string;
};
