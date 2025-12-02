export type OtpConfig = {
  secret: string;
  digits: number;
  period: number;
  algorithm: string;
};
