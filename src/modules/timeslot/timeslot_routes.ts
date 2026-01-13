import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import UtimeslotController from './timeslot_controller';
import UtimeslotValidations from './timeslot_validations';

const router = Router();

router.get('/', JWTToken.validateAccessToken, asyncHandler(UtimeslotController.find));
router.post('/', JWTToken.validateAccessToken, UtimeslotValidations.create, asyncHandler(UtimeslotController.create));
router.patch('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(UtimeslotController.update));
router.delete('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(UtimeslotController.delete));

export default router;
