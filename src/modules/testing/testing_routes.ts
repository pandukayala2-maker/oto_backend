import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import UtestingController from './testing_controller';
import UtestingValidations from './testing_validations';

const router = Router();

router.get('/', JWTToken.validateAccessToken, asyncHandler(UtestingController.find));
router.post('/', JWTToken.validateAccessToken, UtestingValidations.create, asyncHandler(UtestingController.create));
router.patch('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(UtestingController.update));
router.delete('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(UtestingController.delete));

export default router;
