import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import { baseResponse } from '../../middleware/response_handler';
import { NotificationDocument } from './notification_model';
import UnotificationServices from './notification_services';

class NotificationController {
    static send() {}

    static create = async (req: Request, res: Response, next: NextFunction) => {
        const category: NotificationDocument = req.body;
        const data = await UnotificationServices.create(category);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const categoryDoc: NotificationDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await UnotificationServices.update(categoryDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        if (req.query.type) query.type = req.query.type;
        const data: NotificationDocument[] = await UnotificationServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await UnotificationServices.update({ deleted_at: new Date() }, id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default NotificationController;
