import { body, check } from 'express-validator';
import BaseValidator from '../../common/base_validator';
import { categoryTypesEnum } from '../../constant/enum';
import CustomErrorHandler from '../../middleware/error_handler';

class CategoryValidations extends BaseValidator {
    static create = [
        this.nameField(),
        body('image').notEmpty().withMessage('Catgeory image is required.'),
        body('type').isIn(Object.values(categoryTypesEnum)).withMessage('Invalid type'),
        CustomErrorHandler.requestValidator
    ];

    static find = [check('type').optional().isIn(Object.values(categoryTypesEnum)).withMessage('Invalid type'), CustomErrorHandler.requestValidator];
}

export default CategoryValidations;
