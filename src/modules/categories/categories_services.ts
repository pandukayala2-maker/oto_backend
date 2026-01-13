import { CategoryDocument, CategoryModel } from './categories_model';

class CategoryServices {
    static create = async (data: CategoryDocument): Promise<CategoryDocument> => await CategoryModel.create(data);

    static update = async (data: Partial<CategoryDocument>, id: string) => await CategoryModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<CategoryDocument[]> => await CategoryModel.find(filter);

    static findById = async (filter: string) => await CategoryModel.findById(filter);
}

export default CategoryServices;
