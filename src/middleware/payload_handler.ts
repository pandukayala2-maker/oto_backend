import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { BadRequestError, NoContentError } from '../common/base_error';

const payloadHandler = (req: Request, res: Response, next: NextFunction) => {
    if (isEmpty(req.body) && !isFormData(req) && isEmpty(req.query) && isEmpty(req.params) && req.method !== 'GET' && req.method !== 'DELETE') {
        return next(new NoContentError());
    }
    next();
};

function isEmpty(obj: any): boolean {
    return !Object.keys(obj).length;
}

const isFormData = (req: Request): boolean => {
    if (req.is('multipart/form-data')) {
        return true;
    }
    return false;
};

export default payloadHandler;

export const validateId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) return next(new BadRequestError('Invalid ID'));
    next();
};
