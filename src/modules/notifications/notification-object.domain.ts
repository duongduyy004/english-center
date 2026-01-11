import { NOTIFICATION_ENUM } from "./types/notification-type.enum";

export class NotificationObject {
    id: string;
    actorId: string;
    type: NOTIFICATION_ENUM
    data: any;
    createdAt: Date;
}