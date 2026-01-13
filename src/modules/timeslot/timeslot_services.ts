import { UtimeslotDocument, UtimeslotModel } from './timeslot_model';

class UtimeslotServices {
    static create = async (data: UtimeslotDocument): Promise<UtimeslotDocument> => await UtimeslotModel.create(data);

    static update = async (data: Partial<UtimeslotDocument>, id: string) => await UtimeslotModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<UtimeslotDocument[]> => await UtimeslotModel.find(filter);

    static findById = async (filter: string) => await UtimeslotModel.findById(filter);

    static delete = async (id: string) => await UtimeslotModel.findByIdAndDelete(id);
}

export default UtimeslotServices;
