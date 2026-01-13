import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import MediaHandler from '../../middleware/media_handler';
import JWTToken from '../../utils/tokens';
import UserController from './user_controller';

const userRoutes = Router();

userRoutes.get('/', JWTToken.adminAccessToken, asyncHandler(UserController.find));

userRoutes.patch('/:id', MediaHandler.singleMediaHandler, asyncHandler(UserController.update));

export default userRoutes;
