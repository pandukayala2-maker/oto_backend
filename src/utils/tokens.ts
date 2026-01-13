import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../common/base_error';
import Config from '../config/dot_config';
import AppStrings from '../constant/app_strings';
import { logger } from './logger';

export interface IJwtPayload {
    email: string;
    id: string;
    usertype: string;
}

class JWTToken {
    private static refreshTokens = new Set<string>();

    static generateToken(data: object, secretOrPublicKey: jwt.Secret, expireTime?: string | number): string {
        return jwt.sign(data, secretOrPublicKey, { expiresIn: expireTime ?? `${AppStrings.otpExpireTime}m` });
    }

    static generateAccessToken(data: object): string {
        return jwt.sign(data, Config._APP_ACCESSTOKEN, { expiresIn: '15m' });
    }

    static generateRefreshToken(data: object): string {
        const token = jwt.sign(data, Config._APP_REFRESHTOKEN, { expiresIn: '20m' });
        this.refreshTokens.add(token);
        return token;
    }

    static generateVerificationLink(payload: IJwtPayload): string {
        const token = jwt.sign({ id: payload.id, email: payload.email, usertype: payload.usertype }, Config._EMAIL_VERIFY_TOKEN, {
            expiresIn: '60m'
        });
        return `${AppStrings.appUrl()}/v1/auth/verify-email/${token}`;
    }

    static verifyToken(token: string, secretOrPublicKey: jwt.Secret, message?: string): string | jwt.JwtPayload | IJwtPayload {
        try {
            return jwt.verify(token, secretOrPublicKey);
        } catch (error: any) {
            logger.error(error);
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedError(`${message ?? 'Token has expired'}`);
            }
            throw new UnauthorizedError('Invalid token.');
        }
    }

    static decodeToken(req: Request, secretOrPublicKey: jwt.Secret): IJwtPayload | null {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedError();
        return JWTToken.verifyToken(token, secretOrPublicKey) as IJwtPayload;
    }

    static validateAccessToken(req: Request, res: Response, next: NextFunction): any {
        JWTToken.decodeToken(req, Config._APP_ACCESSTOKEN);
        next();
    }

    static adminAccessToken(req: Request, res: Response, next: NextFunction): any {
        const data = JWTToken.decodeToken(req, Config._APP_ACCESSTOKEN);
        if (data?.usertype === 'admin') return next();
        throw new UnauthorizedError();
    }

    static vendorAccessToken(req: Request, res: Response, next: NextFunction): any {
        const data = JWTToken.decodeToken(req, Config._APP_ACCESSTOKEN);
        if (data?.usertype === 'vendor' || data?.usertype === 'admin') return next();
        throw new UnauthorizedError();
    }
}

export default JWTToken;
