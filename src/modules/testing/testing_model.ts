import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface UtestingDocument extends BaseDocument {
    name: string;
}

const testingSchema = new Schema<UtestingDocument>({
    name: { type: String, trim: true, required: true }
});

testingSchema.add(baseSchema);

const UtestingModel = model<UtestingDocument>('testings', testingSchema);

export { UtestingDocument, UtestingModel };
