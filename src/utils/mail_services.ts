import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import Config from '../config/dot_config';
import AppStrings from '../constant/app_strings';
import { AuthDocument } from '../modules/auth/auth_model';
import { logger } from './logger';
import JWTToken, { IJwtPayload } from './tokens';

class MailServices {
    private static imagePath = path.resolve(__dirname, '../../assets/images/logo.png');
    private static imageData = fs.readFileSync(this.imagePath);

    private static transporter = nodemailer.createTransport({
        host: 'auto-meka.com',
        port: 465,
        secure: true,
        auth: {
            user: Config._SMTP_EMAIL_USERNAME,
            pass: Config._SMTP_EMAIL_PASSWORD
        }
    });

    private static sendEmail = async (options: { email: string; subject: string; html?: string; text?: string }): Promise<void> => {
        const { email, subject, html, text } = options;
        try {
            const attachments = {
                filename: 'logo.png',
                content: this.imageData,
                encoding: 'base64',
                cid: 'logo'
            };
            const mailOptions = {
                from: `${AppStrings.app_name} - <${Config._SMTP_EMAIL_USERNAME}>`,
                to: email,
                subject,
                text,
                html,
                attachments: [attachments]
            };
            const info = await this.transporter.sendMail(mailOptions);
            logger.info('Message sent:', info.messageId);
        } catch (error) {
            logger.error('Error sending email:', error);
        }
    };

    static sendEmailVerificationMail = async (payload: IJwtPayload): Promise<void> => {
        try {
            const subject = `Verify Your Email Address - ${AppStrings.app_name}`;
            const templatePath = path.resolve(__dirname, '../../templates/verification_email.html');
            const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
            const link = JWTToken.generateVerificationLink(payload);
            let htmlTemplateWithData = htmlTemplate;
            const regex = /\{\{([^}]+)\}\}/g;
            htmlTemplateWithData = htmlTemplateWithData.replace(regex, (match, placeholder) => {
                if (placeholder === 'verification_link') return link;
                else if (placeholder === 'App_Name') return AppStrings.app_name;
                else if (placeholder === 'App_Path') return AppStrings.appUrl();
                return match;
            });
            await this.sendEmail({ email: payload.email, html: htmlTemplateWithData, subject: subject });
        } catch (error) {
            console.error('Error sending email:', error);
            throw Error('Something went wrong');
        }
    };

    static sendPasswordResetOtpMail = async (auth: AuthDocument, username: string, otp: string): Promise<void> => {
        try {
            const subject = `Reset Password - ${AppStrings.app_name}`;
            const templatePath = path.resolve(__dirname, '../../templates/reset_password.html');
            const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
            let htmlTemplateWithData = htmlTemplate;
            const regex = /\{\{([^}]+)\}\}/g;
            htmlTemplateWithData = htmlTemplateWithData.replace(regex, (match, placeholder) => {
                if (placeholder === 'User_Name') return username;
                else if (placeholder === 'App_Name') return AppStrings.app_name;
                else if (placeholder === 'OTP_Code') return otp;
                else if (placeholder === 'X_minutes') return `${AppStrings.otpExpireTime} minutes`;
                else if (placeholder === 'App_Path') return AppStrings.appUrl();
                return match;
            });
            await this.sendEmail({ email: auth.email, html: htmlTemplateWithData, subject: subject });
        } catch (error) {
            console.error('Error sending email:', error);
            throw Error('Something went wrong');
        }
    };

    // static bookingSuccessfulEmail = async (email: string): Promise<void> => {
    //     try {
    //         const subject = 'Booking Successfully - AutoMeka';

    //         const message = `Dear User\n\nthanks for ordering with AutoMeka! This is your Order Id. \n\nBest Regards,\nAutomeka`;

    //         await this.sendEmail(email, subject, message);
    //     } catch (error) {
    //         console.error('Error sending email:', error);
    //         throw Error('Something went wrong');
    //     }
    // };
}

export default MailServices;
