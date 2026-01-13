import { AddressDocument, AddressModel } from './address_model';

class AddressServices {
    static create = async (data: AddressDocument): Promise<AddressDocument> => await AddressModel.create(data);

    static update = async (data: Partial<AddressDocument>, id: string) => await AddressModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<AddressDocument[]> =>
        await AddressModel.find(filter).populate({ path: 'auth', select: 'auth_id' }).exec();

    static delete = async (id: string) => await AddressModel.findByIdAndDelete(id);
}

export default AddressServices;
