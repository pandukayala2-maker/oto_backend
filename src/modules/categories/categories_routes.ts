import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import MediaHandler from '../../middleware/media_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import CategoryController from './categories_controller';
import CategoryValidations from './categories_validations';

const router = Router();

router.get('/', JWTToken.validateAccessToken, CategoryValidations.find, asyncHandler(CategoryController.find));
router.post('/', JWTToken.adminAccessToken, MediaHandler.singleMediaHandler, CategoryValidations.create, asyncHandler(CategoryController.create));
router.patch('/:id', validateId, JWTToken.adminAccessToken, MediaHandler.singleMediaHandler, asyncHandler(CategoryController.update));
router.delete('/:id', validateId, JWTToken.adminAccessToken, asyncHandler(CategoryController.delete));
// router.get('/:id', asyncHandler(CategoryController.findById));

export default router;
