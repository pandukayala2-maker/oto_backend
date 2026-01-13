import { NotificationDocument, NotificationModel } from './notification_model';

class UnotificationServices {
    static create = async (data: NotificationDocument): Promise<NotificationDocument> => await NotificationModel.create(data);

    static update = async (data: Partial<NotificationDocument>, id: string) => await NotificationModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<NotificationDocument[]> => await NotificationModel.find(filter);

    static findById = async (filter: string) => await NotificationModel.findById(filter);

    static delete = async (id: string) => await NotificationModel.findByIdAndDelete(id);
}

export default UnotificationServices;
