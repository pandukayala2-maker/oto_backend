import { body, ValidationChain } from 'express-validator';

export default class BaseValidator {
    static email = body('email')
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Please provide a valid email address.')
        .trim()
        .normalizeEmail();

    static nameField(name?: string, { minLength = 2, maxLength = 20, isOptional = false } = {}): ValidationChain {
        const fieldName = name ?? 'name';
        let validation = body(fieldName);
        if (isOptional) validation = validation.optional();
        return validation
            .isString()
            .withMessage(`${fieldName} must be a string.`)
            .notEmpty()
            .withMessage(`${fieldName} is required.`)
            .trim()
            .withMessage(`${fieldName} must not contain only whitespace.`)
            .isLength({ min: minLength, max: maxLength })
            .withMessage(`${fieldName} must be between ${minLength} and ${maxLength} characters.`);
    }

    static imageField(name?: string, { isOptional = false } = {}): ValidationChain {
        const fieldName = name ?? 'image';
        let validation = body(fieldName);
        if (isOptional) validation = validation.optional();
        return validation
            .isString()
            .withMessage(`${fieldName} must be a string.`)
            .notEmpty()
            .withMessage(`${fieldName} is required.`)
            .trim()
            .withMessage(`${fieldName} must not contain only whitespace.`);
    }

    static dateRangeValidation(): ValidationChain[] {
        return [
            body('from_date')
                .isISO8601()
                .withMessage('fromDate must be a valid date in ISO 8601 format.')
                .custom((fromDate, { req }) => {
                    const toDate = req.body.toDate;
                    if (!toDate) {
                        throw new Error('toDate is required.');
                    }
                    if (new Date(fromDate) >= new Date(toDate)) {
                        throw new Error('fromDate must be before toDate.');
                    }
                    return true;
                }),

            body('to_date')
                .isISO8601()
                .withMessage('toDate must be a valid date in ISO 8601 format.')
                .custom((toDate, { req }) => {
                    const fromDate = req.body.fromDate;
                    if (!fromDate) {
                        throw new Error('fromDate is required.');
                    }
                    if (new Date(toDate) <= new Date(fromDate)) {
                        throw new Error('toDate must be after fromDate.');
                    }
                    return true;
                })
        ];
    }

    static dateField(name: string, { isOptional = false } = {}) {
        let validation = body(name);
        if (isOptional) validation = validation.optional();
        return validation.isISO8601().withMessage(`${name} must be a valid date in ISO 8601 format.`);
    }

    static optinalField(name: string) {
        return body(name).optional().withMessage(`${name} must be a string if provided.`);
    }

    static mongoIdField(name: string, { isOptional = false } = {}) {
        let validation = body(name);
        if (isOptional) validation = validation.optional();
        return validation.isMongoId().withMessage(`${name} must be a valid MongoDB ObjectId.`);
    }

    static numberField(name: string, { isOptional = false } = {}) {
        let validation = body(name);
        if (isOptional) validation = validation.optional();
        return validation.isNumeric().withMessage(`${name} must be a valid number.`);
    }

    static booleanField(name: string, { isOptional = false } = {}) {
        let validation = body(name);
        if (isOptional) validation = validation.optional();
        return validation.isBoolean().withMessage(`${name} must be a boolean.`);
    }
}
