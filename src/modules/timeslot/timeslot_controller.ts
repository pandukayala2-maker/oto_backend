import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import MediaHandler from '../../middleware/media_handler';
import { baseResponse } from '../../middleware/response_handler';
import { UtimeslotDocument } from './timeslot_model';
import UtimeslotServices from './timeslot_services';

class UtimeslotController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const category: UtimeslotDocument = req.body;
        const data = await UtimeslotServices.create(category);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const categoryDoc: UtimeslotDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await UtimeslotServices.update(categoryDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        if (req.query.type) query.type = req.query.type;
        const data: UtimeslotDocument[] = await UtimeslotServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await UtimeslotServices.update({ deleted_at: new Date() }, id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default UtimeslotController;
