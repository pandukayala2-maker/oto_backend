import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface UtimeslotDocument extends BaseDocument {
    name: string;
}

const timeslotSchema = new Schema<UtimeslotDocument>({
    name: { type: String, trim: true, required: true }
});

timeslotSchema.add(baseSchema);

const UtimeslotModel = model<UtimeslotDocument>('timeslots', timeslotSchema);

export { UtimeslotDocument, UtimeslotModel };
