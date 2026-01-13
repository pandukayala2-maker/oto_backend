import dotenv from 'dotenv';

dotenv.config();

export default class Config {
    static readonly _APP_ENV: string = process.env.ENV || 'development';
    static readonly _APP_URL: string = process.env.APP_URL || '';

    static readonly _PORT: string = process.env.PORT || '4321';
    static readonly _DB_URL: string = process.env.DATABASE_URL || '';
    static readonly _DB_NAME: string = process.env.DATABASE_NAME || '';
    static readonly _DB_USER: string = process.env.USER_NAME || '';
    static readonly _DB_PASS: string = process.env.PASSWORD || '';

    static readonly _APP_ACCESSTOKEN: string = process.env.ACCESS_TOKEN_SECRET || '';
    static readonly _APP_REFRESHTOKEN: string = process.env.REFRESH_TOKEN_SECRET || '';
    static readonly _EMAIL_VERIFY_TOKEN: string = process.env.VERIFICATION_EMAIL_TOKEN_SECRET || '';
    static readonly _OTP_TOKEN: string = process.env.OTP_TOKEN_SECRET || '';

    static readonly _STATIC_PATH: string = process.env.STATIC_PATH || '';

    static readonly _SMTP_EMAIL_USERNAME: string = process.env.SMTP_EMAIL_USERNAME || '';
    static readonly _SMTP_EMAIL_PASSWORD: string = process.env.SMTP_EMAIL_PASSWORD || '';
}
