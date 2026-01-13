import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { BadRequestError, ServerIssueError, UnauthorizedError } from '../../common/base_error';
import Config from '../../config/dot_config';
import MediaHandler from '../../middleware/media_handler';
import { baseResponse } from '../../middleware/response_handler';
import JWTToken from '../../utils/tokens';
import { BannerDocument } from './banner_model';
import BannerService from './banner_services';

class BannerController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const banner: BannerDocument = req.body;
        const tokenData = JWTToken.decodeToken(req, Config._APP_ACCESSTOKEN)!;
        banner.vendor_id = new Types.ObjectId(tokenData.id);
        const data = await BannerService.create(banner);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const bannerDoc: BannerDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        const banner: BannerDocument | null = await BannerService.findbyId(id);
        if (!banner) throw new BadRequestError('Banner does not exist');
        const tokenData = JWTToken.decodeToken(req, Config._APP_ACCESSTOKEN)!;
        if (banner.vendor_id.toString() != tokenData.id) throw new UnauthorizedError();
        if (bannerDoc.image) {
            const fullPath: string = MediaHandler.getRootPath() + banner?.image;
            await MediaHandler.removeFile(fullPath);
        }
        const data = await BannerService.update(bannerDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        const tokenData = JWTToken.decodeToken(req, Config._APP_ACCESSTOKEN)!;
        if (tokenData.usertype === 'vendor') query.vendor_id = tokenData.id;
        if (tokenData.usertype === 'user') query.toDate = { $gte: new Date() };
        const data: BannerDocument[] = await BannerService.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await BannerService.delete(id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default BannerController;
