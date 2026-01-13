import BaseValidator from '../../common/base_validator';
import CustomErrorHandler from '../../middleware/error_handler';

class AddressValidations extends BaseValidator {
    static create = [
        this.nameField(),
        this.nameField('area'),
        this.nameField('block'),
        this.nameField('house'),
        this.nameField('street'),
        CustomErrorHandler.requestValidator
    ];
}

export default AddressValidations;
