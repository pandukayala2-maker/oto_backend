import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import Config from '../../config/dot_config';
import { baseResponse } from '../../middleware/response_handler';
import JWTToken from '../../utils/tokens';
import { AddressDocument } from './address_model';
import AddressServices from './address_services';
import { Types } from 'mongoose';

class AddressController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const address: AddressDocument = req.body;
        const tokenData = JWTToken.decodeToken(req, Config._APP_ACCESSTOKEN)!;
        address.auth_id = new Types.ObjectId(tokenData.id);
        const data = await AddressServices.create(address);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const addressDoc: AddressDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await AddressServices.update(addressDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        query.auth_id = JWTToken.decodeToken(req, Config._APP_ACCESSTOKEN)!.id;
        const data: AddressDocument[] = await AddressServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await AddressServices.delete(id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default AddressController;
