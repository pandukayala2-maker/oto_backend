// import * as bcrypt from 'bcrypt';
import { AuthDocument, AuthModel } from './auth_model';

class AuthService {
    static create = async (data: AuthDocument): Promise<AuthDocument> => await AuthModel.create(data);

    static update = async (data: Partial<AuthDocument>, id: string) => await AuthModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter?: any) => await AuthModel.find(filter);

    static findOne = async (filter: any) => await AuthModel.findOne(filter);

    static deletebyId = async (id: string) => await AuthModel.findByIdAndDelete(id);

    static aggregateFind = [
        {
            $lookup: {
                from: 'auths',
                localField: '_id',
                foreignField: '_id',
                as: 'authData'
            }
        }, //this part will fetch data comparing _id from auth and user or vendor collection and add that in query in list of auth data
        {
            $unwind: '$authData' // this will put the first data in authdata list in a object
        },
        {
            $match: {
                'authData.deleted_at': { $eq: null }, // check the auth deleted_at is null (eq == equal)
                'authData.is_disabled': false // check the auth is_disabled
            }
        },
        {
            $project: {
                authData: 0 // Exclude the authData field
            }
        }
    ];
}

export default AuthService;
