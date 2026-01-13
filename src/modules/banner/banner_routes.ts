import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import MediaHandler from '../../middleware/media_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import BannerController from './banner_controller';
import BannerValidation from './banner_validations';

const router = Router();

router.get('/', JWTToken.validateAccessToken, asyncHandler(BannerController.find));
router.post('/', JWTToken.vendorAccessToken, MediaHandler.singleMediaHandler, BannerValidation.create, asyncHandler(BannerController.create));
router.patch('/:id', validateId, JWTToken.vendorAccessToken, MediaHandler.singleMediaHandler, asyncHandler(BannerController.update));
router.delete('/:id', validateId, JWTToken.vendorAccessToken, asyncHandler(BannerController.delete));

export default router;
