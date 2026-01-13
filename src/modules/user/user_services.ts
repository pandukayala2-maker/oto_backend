// import * as bcrypt from 'bcrypt';
import AuthService from '../auth/auth_services';
import { UserDocument, UserModel } from './user_model';

class UserService {
    static create = async (data: UserDocument): Promise<UserDocument> => await UserModel.create(data);

    static update = async (data: Partial<UserDocument>, id: string) => await UserModel.findByIdAndUpdate(id, data, { new: true });

    /// only to use under auth validation
    static findOne = async (filter: any) => await UserModel.findOne(filter);

    /// arregates to check data between auth and user model
    static find = async (filter: any) => {
        const pipeline = [...AuthService.aggregateFind, { $match: filter }];
        return await UserModel.aggregate(pipeline);
    };

    static findById = async (id: string) => await UserModel.findById(id);
}

export default UserService;
