import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';
import { categoryTypesEnum } from '../../constant/enum';

interface CategoryDocument extends BaseDocument {
    name: string;
    image: string;
    type: categoryTypesEnum;
}

const categorySchema = new Schema<CategoryDocument>({
    name: { type: String, trim: true, required: true },
    image: { type: String, required: true },
    type: { type: String, enum: Object.values(categoryTypesEnum), required: true }
});

categorySchema.add(baseSchema);

categorySchema.index({ name: 1, deleted_at: 1, type: 1 }, { unique: true });

const CategoryModel = model<CategoryDocument>('categories', categorySchema);

export { CategoryDocument, CategoryModel };
