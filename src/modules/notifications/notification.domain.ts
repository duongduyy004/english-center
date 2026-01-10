import { NotificationObject } from "./notification-object.domain";

export class Notification {
    id: string;
    recipientId: string;
    object?: NotificationObject;
    isRead: boolean;
    createdAt: Date;
}