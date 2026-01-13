import { Response } from 'express';
import { statusMsgEnum } from '../common/base_error';

interface IResponse<T> {
    message: string;
    status: boolean;
    data?: T | null;
    error?: any | null;
}

export const baseResponse = <T>(options: { res: Response; data?: T; error?: any; code?: number; message?: string }): Response => {
    const { res, data, error, code = 200, message = statusMsgEnum.success } = options;
    const response: IResponse<T> = {
        message,
        status: code === 200,
        data,
        error
    };

    return res.status(code).json(response);
};
