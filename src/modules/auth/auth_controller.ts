import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { BadRequestError, ServerIssueError } from '../../common/base_error';
import Config from '../../config/dot_config';
import AppStrings from '../../constant/app_strings';
import { baseResponse } from '../../middleware/response_handler';
import { generateHtmlTemplate, generateOTP } from '../../utils/helper';
import MailServices from '../../utils/mail_services';
import JWTToken, { IJwtPayload } from '../../utils/tokens';
import { UserDocument } from '../user/user_model';
import UserService from '../user/user_services';
import { VendorDocument } from '../vendor/vendor_model';
import VendorService from '../vendor/vendor_services';
import { AuthDocument } from './auth_model';
import AuthService from './auth_services';

class AuthController {
    static signup = async (req: Request, res: Response, next: NextFunction) => {
        const authDoc: AuthDocument = req.body;
        const email: string = authDoc.email;
        const existingUser = await AuthService.findOne({ email });
        if (existingUser) throw new BadRequestError('email is already in use');
        const auth = await AuthService.create(authDoc);
        if (!auth) throw new ServerIssueError('Error while creating profile');
        if (authDoc.usertype === 'vendor' || authDoc.usertype === 'admin') {
            const vendorDoc: VendorDocument = req.body;
            vendorDoc._id = auth.id;
            const vendor = await VendorService.create(vendorDoc);
            if (!vendor) {
                await AuthService.deletebyId(auth.id);
                throw new ServerIssueError('Error while creating profile');
            }
            return baseResponse({ res: res, data: vendor });
        } else if (authDoc.usertype === 'user') {
            const userDoc: UserDocument = req.body;
            userDoc._id = auth.id;
            const user = await UserService.create(userDoc);
            if (!user) {
                await AuthService.deletebyId(auth.id);
                throw new ServerIssueError('Error while creating profile');
            }
            return baseResponse({ res: res, data: user });
        }
        throw new BadRequestError('Invalid User');
    };

    static signin = async (req: Request, res: Response, next: NextFunction) => {
        const authDoc: AuthDocument = req.body;
        const email: string = authDoc.email;
        const auth = await AuthService.findOne({ email });
        if (!auth) throw new BadRequestError('user does not exist');
        if (auth.usertype !== authDoc.usertype && !(auth.usertype === 'admin' && authDoc.usertype === 'vendor'))
            throw new BadRequestError('You cannot log in here');
        if (auth.deleted_at || auth.is_disabled) throw new BadRequestError('The user may have been deleted or disabled by the admin');
        if (!(await auth.comparePassword(authDoc.password))) throw new ServerIssueError('Authentication Failed');
        if (!auth.is_email_verified) await this.sendVerificationLink(auth);
        await auth.updateLastLogin();
        await AuthController.generateTokenAndRespond(auth, res);
    };

    private static async sendVerificationLink(auth: AuthDocument): Promise<void> {
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        if (auth.last_login !== undefined && auth.last_login.getTime() >= oneHourAgo) {
            throw new BadRequestError('Verification link already sent. Please check your inbox or spam folder.');
        }
        const payload: IJwtPayload = { email: auth.email, id: auth.id, usertype: auth.usertype };
        try {
            await MailServices.sendEmailVerificationMail(payload);
            await auth.updateLastLogin();
            throw new BadRequestError('A verification link is sent to the email');
        } catch (error) {
            throw error;
        }
    }

    static verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.params.token;
            const decoded = JWTToken.verifyToken(token, Config._EMAIL_VERIFY_TOKEN) as IJwtPayload;
            const auth = await AuthService.findOne({ _id: decoded.id });
            if (!auth) throw new BadRequestError('user does not exist');
            auth.is_email_verified = true;
            await auth.save();
            const templatePath = path.resolve(__dirname, '../../../templates/verification_email_success.html');
            const fields = { App_Name: AppStrings.app_name, App_Path: AppStrings.appUrl() };
            const generatedHtml: string = generateHtmlTemplate(templatePath, fields);
            return res.send(generatedHtml);
        } catch (error) {
            const templatePath = path.resolve(__dirname, '../../../templates/verification_email_success.html');
            const fields = { App_Name: AppStrings.app_name, App_Path: AppStrings.appUrl() };
            const generatedHtml: string = generateHtmlTemplate(templatePath, fields);
            return res.send(generatedHtml);
        }
    };

    static sendPasswordResetOtp = async (req: Request, res: Response, next: NextFunction) => {
        const email: string = req.body.email;
        const auth = await AuthService.findOne({ email });
        if (!auth) throw new BadRequestError('user does not exist');
        if (auth.deleted_at || auth.is_disabled) throw new BadRequestError('The user may have been deleted or disabled by the admin');
        let username = 'username';
        if (auth.usertype === 'vendor' || auth.usertype === 'admin') {
            username = (await VendorService.findOne({ email }))?.firstname ?? 'vender';
        } else if (auth.usertype === 'user') {
            username = (await UserService.findOne({ email }))?.firstname ?? 'user';
        }
        const otp = generateOTP();
        await MailServices.sendPasswordResetOtpMail(auth, username, otp);
        const payload = { otp, email: auth.email, usertype: auth.usertype, id: auth.id };
        const link = JWTToken.generateToken(payload, Config._OTP_TOKEN);
        return baseResponse({ res: res, message: 'An Otp is sent to the email', data: { token: link } });
    };

    static verifyResetOtp = async (req: Request, res: Response, next: NextFunction) => {
        const { token, otp } = req.body;
        const decoded = JWTToken.verifyToken(token, Config._OTP_TOKEN, 'otp') as any;
        if (decoded.otp != otp) throw new BadRequestError('Invalid Otp');
        const auth = await AuthService.findOne({ _id: decoded.id });
        if (!auth) throw new BadRequestError('user does not exist');
        const payload = { password: auth.password, email: auth.email, usertype: auth.usertype, id: auth.id };
        const link = JWTToken.generateToken(payload, Config._APP_ACCESSTOKEN);
        return baseResponse({ res: res, message: 'Success', data: { token: link } });
    };

    static updatePassword = async (req: Request, res: Response, next: NextFunction) => {
        const { password, token, new_password } = req.body;
        const decoded = JWTToken.verifyToken(token, Config._APP_ACCESSTOKEN) as any;
        const encrptyedPassword = decoded.password;
        const auth = await AuthService.findOne({ _id: decoded.id });
        if (!auth) throw new BadRequestError('user does not exist');
        if (password) {
            if (!(await auth.comparePassword(password))) throw new BadRequestError('Authentication Failed');
        } else if (encrptyedPassword) {
            if (encrptyedPassword != auth.password) throw new BadRequestError('Authentication Failed');
        } else {
            throw new BadRequestError('Password or token is invalid');
        }
        auth.password = new_password;
        auth.save();
        await this.generateTokenAndRespond(auth, res);
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;
        const { is_disabled, fcm_token } = req.body;
        const auth = await AuthService.update({ is_disabled, fcm_token }, id);
        return auth ? baseResponse({ res: res, data: auth, message: 'successfully updated' }) : next(new ServerIssueError());
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;
        const auth = await AuthService.update({ deleted_at: new Date() }, id);
        return auth ? baseResponse({ res: res, message: 'successfully deleted' }) : next(new ServerIssueError());
    };

    static validateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.body.token;
        if (!token) throw new BadRequestError('Token is requried');
        const validatedToken = JWTToken.verifyToken(token, Config._APP_REFRESHTOKEN, 'Token expired please login again') as IJwtPayload;
        const auth = await AuthService.findOne({ email: validatedToken.email });
        if (!auth) throw new BadRequestError('user does not exist');
        await AuthController.generateTokenAndRespond(auth, res);
    };

    private static async generateTokenAndRespond(auth: AuthDocument, res: Response) {
        const tokenData: IJwtPayload = {
            email: auth.email,
            id: auth.id,
            usertype: auth.usertype
        };
        const accessToken = JWTToken.generateAccessToken(tokenData);
        const refreshToken = JWTToken.generateRefreshToken(tokenData);
        if (auth.usertype === 'vendor' || auth.usertype === 'admin') {
            const vendor = await VendorService.findOne({ email: auth.email });
            if (!vendor) throw new ServerIssueError('Error while fetching profile');
            const combinedData = { ...vendor.toJSON(), accessToken, refreshToken };
            return baseResponse({ res: res, data: combinedData });
        } else if (auth.usertype === 'user') {
            const user = await UserService.findOne({ email: auth.email });
            if (!user) throw new ServerIssueError('Error while fetching profile');
            const combinedData = { ...user.toJSON(), accessToken, refreshToken };
            return baseResponse({ res: res, data: combinedData });
        }
        throw new ServerIssueError('Error while fetching profile');
    }
}

export default AuthController;
