// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { NextFunction, Request, Response } from 'express';
// import mongoose, { ClientSession } from 'mongoose';
// import { baseResponse } from '../../middleware/response_handler';
// import { BadRequestError, ServerIssueError } from '../../utils/base_error';
// import { logger } from '../../utils/logger';
// import { AuthDocument } from './vendor_model';
// import AuthService from './vendor_services';

// class AuthController {
//     static signup = async (req: Request, res: Response, next: NextFunction) => {
//         const session: ClientSession = await mongoose.startSession();
//         try {
//             session.startTransaction();
//             const authDoc: AuthDocument = req.body;
//             const email: string = authDoc.email;
//             const existingUser = await AuthService.findOne({ email });
//             if (existingUser) throw new BadRequestError('email is already in use');
//             const auth = await AuthService.create(authDoc);
//             if (!auth) throw new ServerIssueError();

//             return baseResponse({ res: res, data: auth });
//         } catch (error) {
//             await session.abortTransaction();
//             logger.error(error);
//             return next(error);
//         } finally {
//             await session.endSession();
//         }
//     };
// }

// export default AuthController;
