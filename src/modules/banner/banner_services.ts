import { BannerDocument, BannerModel } from './banner_model';

class BannerServices {
    static create = async (data: BannerDocument): Promise<BannerDocument> => await BannerModel.create(data);

    static update = async (data: Partial<BannerDocument>, id: string) => await BannerModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<BannerDocument[]> => await BannerModel.find(filter);

    static findbyId = async (id: string): Promise<BannerDocument | null> => await BannerModel.findById(id);

    static delete = async (id: string) => await BannerModel.findByIdAndDelete(id);
}

export default BannerServices;
