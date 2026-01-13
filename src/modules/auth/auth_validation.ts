import { body } from 'express-validator';
import BaseValidator from '../../common/base_validator';
import { userTypeEnum } from '../../constant/enum';
import ErrorHandler from '../../middleware/error_handler';

export default class AuthValidations extends BaseValidator {
    static create = [
        this.email,
        body('password').notEmpty().withMessage('password is required.'),
        body('usertype')
            .isIn(Object.values(userTypeEnum).filter((type) => type !== 'admin'))
            .withMessage('Invalid usertype, admin is not allowed.'),
        ErrorHandler.requestValidator
    ];

    static signin = [
        this.email,
        body('password').notEmpty().withMessage('password is required.'),
        body('usertype').isIn(Object.values(userTypeEnum)).withMessage('Invalid usertype '),
        ErrorHandler.requestValidator
    ];

    static otpverification = [
        body('otp')
            .notEmpty()
            .withMessage('OTP is required.')
            .isLength({ min: 6, max: 6 })
            .withMessage('OTP must be exactly 6 digits long.')
            .isNumeric()
            .withMessage('OTP must be a number.'),
        body('token').notEmpty().withMessage('token is required.'),
        ErrorHandler.requestValidator
    ];

    static sendOtp = [this.email, ErrorHandler.requestValidator];

    static update = [body('is_disabled').optional(), body('is_disabled').optional(), ErrorHandler.requestValidator];

    static updatepassword = [
        body('password').optional(),
        body('token').notEmpty().withMessage('token is required'),
        body('new_password').notEmpty().withMessage('new_password is required'),
        ErrorHandler.requestValidator
    ];

    static refreshtoken = [body('token').notEmpty().withMessage('token is required.'), ErrorHandler.requestValidator];
}
