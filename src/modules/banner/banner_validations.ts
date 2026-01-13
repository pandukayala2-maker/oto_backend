import BaseValidator from '../../common/base_validator';
import CustomErrorHandler from '../../middleware/error_handler';

class BannerValidations extends BaseValidator {
    static create = [
        this.nameField(),
        this.imageField('image'),
        ...this.dateRangeValidation(),
        this.mongoIdField('product_link', { isOptional: true }),
        CustomErrorHandler.requestValidator
    ];
}

export default BannerValidations;
