import { Document, Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface VendorDocument extends BaseDocument {
    email: string;
    is_admin?: boolean;
    firstname?: string;
}

const vendorSchema = new Schema<VendorDocument>({
    email: { type: String, required: true, unique: true, immutable: true },
    is_admin: { type: Boolean },
    firstname: { type: String }
});

vendorSchema.add(baseSchema);

const VendorModel = model<VendorDocument>('vendors', vendorSchema);

export { VendorDocument, VendorModel };
