import { UtestingDocument, UtestingModel } from './testing_model';

class UtestingServices {
    static create = async (data: UtestingDocument): Promise<UtestingDocument> => await UtestingModel.create(data);

    static update = async (data: Partial<UtestingDocument>, id: string) => await UtestingModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<UtestingDocument[]> => await UtestingModel.find(filter);

    static findById = async (filter: string) => await UtestingModel.findById(filter);

    static delete = async (id: string) => await UtestingModel.findByIdAndDelete(id);
}

export default UtestingServices;
