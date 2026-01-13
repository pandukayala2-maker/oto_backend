import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import MediaHandler from '../../middleware/media_handler';
import { baseResponse } from '../../middleware/response_handler';
import { CategoryDocument } from './categories_model';
import CategoryServices from './categories_services';

class CategoryController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const category: CategoryDocument = req.body;
        const data = await CategoryServices.create(category);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const categoryDoc: CategoryDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        if (categoryDoc.image) {
            const previousData = await CategoryServices.findById(id);
            const fullPath: string = MediaHandler.getRootPath() + previousData?.image;
            await MediaHandler.removeFile(fullPath);
        }
        const data = await CategoryServices.update(categoryDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        if (req.query.type) query.type = req.query.type;
        const data: CategoryDocument[] = await CategoryServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await CategoryServices.update({ deleted_at: new Date() }, id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default CategoryController;
