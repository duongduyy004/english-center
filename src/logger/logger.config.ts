import * as winston from 'winston';

export const winstonConfig = {
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, context }) => {
                    return `${timestamp} [${level}]${context ? ' [' + context + ']' : ''} ${message}`;
                })
            ),
        }),
    ],
};
