import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface UserDocument extends BaseDocument {
    email: string;
    image?: string;
    firstname?: string;
}

const userSchema = new Schema<UserDocument>({
    email: { type: String, required: true, unique: true, immutable: true },
    image: { type: String },
    firstname: { type: String }
});

userSchema.add(baseSchema);

const UserModel = model<UserDocument>('users', userSchema);
export { UserDocument, UserModel };
