import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import NotificationController from './notification_controller';
import NotificationValidations from './notification_validations';

const router = Router();

router.get('/', JWTToken.validateAccessToken, asyncHandler(NotificationController.find));
router.post('/', JWTToken.validateAccessToken, NotificationValidations.create, asyncHandler(NotificationController.create));
router.patch('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(NotificationController.update));
router.delete('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(NotificationController.delete));

export default router;
