import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import MediaHandler from '../../middleware/media_handler';
import { validateId } from '../../middleware/payload_handler';
import authController from './auth_controller';
import AuthValidations from './auth_validation';

const authRouter = Router();

authRouter.get('/verify-email/:token', asyncHandler(authController.verifyEmail));
// authRouter.get('/', asyncHandler(authController.findAll));

authRouter.post('/signup', MediaHandler.singleMediaHandler, AuthValidations.create, asyncHandler(authController.signup));
authRouter.post('/signin', AuthValidations.signin, asyncHandler(authController.signin));
authRouter.post('/send-resetotp', AuthValidations.sendOtp, asyncHandler(authController.sendPasswordResetOtp));
authRouter.post('/verify-resetotp', AuthValidations.otpverification, asyncHandler(authController.verifyResetOtp));

authRouter.patch('/refresh-token', AuthValidations.refreshtoken, asyncHandler(authController.validateRefreshToken));
authRouter.patch('/update-password', AuthValidations.updatepassword, asyncHandler(authController.updatePassword));
authRouter.patch('/:id', validateId, AuthValidations.update, asyncHandler(authController.update));

authRouter.delete('/:id', validateId, asyncHandler(authController.delete));

export default authRouter;
