import { Schema, Types, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';
import { AuthDocument } from '../auth/auth_model';
import { ProductDocument } from '../product/product_model';

interface BannerDocument extends BaseDocument {
    name: string;
    image: string;
    from_date: Date;
    to_date: Date;
    product_link?: Types.ObjectId | ProductDocument;
    vendor_id: Types.ObjectId | AuthDocument;
}

const bannerSchema = new Schema<BannerDocument>({
    name: { type: String, trim: true },
    image: { type: String },
    from_date: { type: Date },
    to_date: { type: Date },
    vendor_id: {
        ref: 'vendors',
        type: Schema.Types.ObjectId,
        required: true
    },
    product_link: {
        ref: 'products',
        type: Schema.Types.ObjectId
    }
});

bannerSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        const baseTransform = baseSchema.get('toJSON')?.transform;
        if (typeof baseTransform === 'function') {
            baseTransform(doc, ret, options);
        }
        // ret.auth = ret.vendor_id;
        delete ret.vendor_id;
    }
});

bannerSchema.add(baseSchema);

const BannerModel = model<BannerDocument>('banners', bannerSchema);

export { BannerDocument, BannerModel };
