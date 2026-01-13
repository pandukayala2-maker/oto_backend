import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface BrandDocument extends BaseDocument {
    name: string;
    image: string;
}

const brandSchema = new Schema<BrandDocument>({
    name: { type: String, trim: true, required: true },
    image: { type: String, required: true }
});

brandSchema.add(baseSchema);

brandSchema.index({ name: 1, deleted_at: 1 }, { unique: true });

const BrandModel = model<BrandDocument>('brand', brandSchema);

export { BrandDocument, BrandModel };
