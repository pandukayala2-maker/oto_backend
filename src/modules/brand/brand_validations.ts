import BaseValidator from '../../common/base_validator';
import CustomErrorHandler from '../../middleware/error_handler';

class BrandValidations extends BaseValidator {
    static create = [this.nameField('name', { isOptional: true }), this.imageField(), CustomErrorHandler.requestValidator];
}

export default BrandValidations;
