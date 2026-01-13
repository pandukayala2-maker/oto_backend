import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import MediaHandler from '../../middleware/media_handler';
import { baseResponse } from '../../middleware/response_handler';
import { UserDocument } from './user_model';
import UserService from './user_services';

class UserController {
    static update = async (req: Request, res: Response, next: NextFunction) => {
        const userDoc: UserDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        if (userDoc.image) {
            const previousData = await UserService.findById(id);
            const fullPath: string = MediaHandler.getRootPath() + previousData?.image;
            await MediaHandler.removeFile(fullPath);
        }
        const data = await UserService.update(userDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        const data: UserDocument[] = await UserService.find(query);
        return baseResponse({ res: res, data: data });
    };
}

export default UserController;
