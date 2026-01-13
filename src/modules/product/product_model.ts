import { Schema, Types, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';
import { BrandDocument } from '../brand/brand_model';

interface ProductDocument extends BaseDocument {
    name: string;
    images?: string[];
    brand_id: Types.ObjectId | BrandDocument;
}

const productSchema = new Schema<ProductDocument>({
    name: { type: String, required: true },
    images: { type: [String] },
    brand_id: {
        ref: 'brand',
        type: Schema.Types.ObjectId,
        required: true
    }
});

productSchema.add(baseSchema);

const ProductModel = model<ProductDocument>('products', productSchema);

export { ProductDocument, ProductModel };
