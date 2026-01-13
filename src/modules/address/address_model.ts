import { Schema, Types, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';
import { AuthDocument } from '../auth/auth_model';

interface AddressDocument extends BaseDocument {
    name: string;
    street: string;
    area: string;
    block: string;
    house: string;
    extra?: string;
    auth_id: Types.ObjectId | AuthDocument;
}

const addressSchema = new Schema<AddressDocument>({
    name: { type: String, trim: true },
    street: { type: String, trim: true },
    area: { type: String, trim: true },
    block: { type: String, trim: true },
    house: { type: String, trim: true },
    extra: { type: String, trim: true },
    auth_id: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

addressSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        const baseTransform = baseSchema.get('toJSON')?.transform;
        if (typeof baseTransform === 'function') {
            baseTransform(doc, ret, options);
        }
        // ret.auth = ret.auth_id;
        delete ret.auth_id;
    }
});

addressSchema.add(baseSchema);

const AddressModel = model<AddressDocument>('addresses', addressSchema);

export { AddressDocument, AddressModel };
