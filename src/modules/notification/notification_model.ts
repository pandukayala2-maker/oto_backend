import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface NotificationDocument extends BaseDocument {
    body: string;
    title: string;
}

const notificationSchema = new Schema<NotificationDocument>({
    body: { type: String, trim: true },
    title: { type: String, trim: true }
});

notificationSchema.add(baseSchema);

const NotificationModel = model<NotificationDocument>('notifications', notificationSchema);

export { NotificationDocument, NotificationModel };
