import { NOTIFICATION_ENUM } from "../types/notification-type.enum";

export const NOTIFICATION_CONFIG = {
    [NOTIFICATION_ENUM.PAYMENT_REMINDER]: {
        title: 'Thanh toán học phí',
        entityName: 'payments',
    },
    [NOTIFICATION_ENUM.PAYMENT_SUCCESS]: {
        title: 'Thanh toán thành công',
        entityName: 'payments',
    },
    [NOTIFICATION_ENUM.STUDENT_ABSENT]: {
        title: 'Học viên vắng mặt',
        entityName: 'sessions',
    },
    [NOTIFICATION_ENUM.STUDENT_LATE]: {
        title: 'Học viên đi muộn',
        entityName: 'sessions',
    },
    [NOTIFICATION_ENUM.CLASS_REMINDER]: {
        title: 'Sắp đến giờ học',
        entityName: 'class',
    },
} as const
