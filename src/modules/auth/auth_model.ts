import * as bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';
import { userTypeEnum } from '../../constant/enum';

interface AuthDocument extends BaseDocument {
    email: string;
    password: string;
    fcm_token?: string;
    usertype: userTypeEnum;
    otp?: number;
    is_phone_verified: boolean;
    is_email_verified: boolean;
    last_login?: Date;

    // Instance methods
    comparePassword: (candidatePassword: string) => Promise<boolean>;
    updateLastLogin: () => Promise<void>;
}

const authSchema = new Schema<AuthDocument>({
    email: { type: String, required: [true, 'name is required'], unique: true, immutable: true },
    password: { type: String, required: true },
    fcm_token: { type: String },
    usertype: { type: String, enum: Object.values(userTypeEnum), default: userTypeEnum.user },
    otp: { type: Number },
    is_email_verified: { type: Boolean, default: false },
    is_phone_verified: { type: Boolean, default: false },
    last_login: { type: Date }
});

authSchema.add(baseSchema);

authSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        const baseTransform = baseSchema.get('toJSON')?.transform;
        if (typeof baseTransform === 'function') {
            baseTransform(doc, ret, options);
        }
        delete ret.password;
    }
});

authSchema.pre('save', function (next) {
    const data = this as AuthDocument;
    if (!data.isModified('password')) return next();
    const saltRounds: number = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(data.password!, salt, (err, hash) => {
            if (err) return next(err);
            data.password = hash;
            next();
        });
    });
});

authSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password!);
};

authSchema.methods.updateLastLogin = async function (): Promise<void> {
    this.last_login = new Date();
    await this.save();
};

const AuthModel = model<AuthDocument>('auths', authSchema);
export { AuthDocument, AuthModel };
