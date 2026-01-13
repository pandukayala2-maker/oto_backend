import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import MediaHandler from '../../middleware/media_handler';
import { baseResponse } from '../../middleware/response_handler';
import { BrandDocument } from './brand_model';
import BrandServices from './brand_services';

class BrandController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const brand: BrandDocument = req.body;
        const data = await BrandServices.create(brand);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const brandDoc: BrandDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        if (brandDoc.image) {
            const previousData = await BrandServices.findById(id);
            const fullPath: string = MediaHandler.getRootPath() + previousData?.image;
            await MediaHandler.removeFile(fullPath);
        }
        const data = await BrandServices.update(brandDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        const data: BrandDocument[] = await BrandServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const brand: boolean = await BrandServices.isBrandAssociatedWithProduct(id);
        let data;
        if (brand) data = await BrandServices.update({ deleted_at: new Date() }, id);
        else data = await BrandServices.delete(id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default BrandController;
