// import * as bcrypt from 'bcrypt';
import AuthService from '../auth/auth_services';
import { VendorDocument, VendorModel } from './vendor_model';

class VendorService {
    static create = async (data: VendorDocument): Promise<VendorDocument> => await VendorModel.create(data);

    static findOne = async (filter: any) => await VendorModel.findOne(filter);

    static findById = async (filter: string) => await VendorModel.findById(filter);

    static find = async (filter: any) => {
        const pipeline = [...AuthService.aggregateFind, { $match: filter }];
        return await VendorModel.aggregate(pipeline);
    };

    // static update = async (data: Partial<VendorDocument>, id: string) =>
    //     await VendorModel.findByIdAndUpdate(id, data, { new: true });

    // static updatePassword = async (password: string, id: string): Promise<VendorDocument | null> => {
    //     try {
    //         const saltRounds: number = 10;
    //         const salt: string = bcrypt.genSaltSync(saltRounds);
    //         const plainPassword: string = password!;
    //         const hashedPassword: string = bcrypt.hashSync(plainPassword, salt);

    //         const authData: VendorDocument | null = await VendorModel.findByIdAndUpdate(
    //             id,
    //             { password: hashedPassword },
    //             { new: true }
    //         );
    //         return authData;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    // static find = async (filter: {}) => await VendorModel.find(filter);

    // static updateFcmToken = async (token: string, id: string) =>
    //     await VendorModel.findOneAndUpdate({ _id: id }, { $set: { fcm_token: token } }, { new: true });
}

export default VendorService;
