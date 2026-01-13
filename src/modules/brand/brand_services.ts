import { ProductModel } from '../product/product_model';
import { BrandDocument, BrandModel } from './brand_model';

class CategoryServices {
    static create = async (data: BrandDocument): Promise<BrandDocument> => await BrandModel.create(data);
    static update = async (data: Partial<BrandDocument>, id: string) => await BrandModel.findByIdAndUpdate(id, data, { new: true });
    static find = async (filter: any): Promise<BrandDocument[]> => await BrandModel.find(filter);
    static findById = async (id: string) => await BrandModel.findById(id);
    static delete = async (id: string) => await BrandModel.findByIdAndDelete(id);
    static isBrandAssociatedWithProduct = async (id: string): Promise<boolean> => (await ProductModel.countDocuments({ brand_id: id })) > 0;
}

export default CategoryServices;
