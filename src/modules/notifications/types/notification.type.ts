import { NOTIFICATION_ENUM } from "./notification-type.enum"

export type NotificationType =
    | PAYMENT_REMINDER
    | PAYMENT_SUCCESS
    | STUDENT_ABSENT
    | STUDENT_LATE
    | CLASS_REMINDER

interface NotificationBase<T, Body, Metadata> {
    id: T
    title: string
    entityName: string
    body: Body
    metadata: Metadata
}

export type PAYMENT_REMINDER = NotificationBase<
    NOTIFICATION_ENUM.PAYMENT_REMINDER,
    {
        amount: number,
        studentName: string,
        month: number,
        year: number
    },
    {
        entityId: string;
    }
>

export type PAYMENT_SUCCESS = NotificationBase<
    NOTIFICATION_ENUM.PAYMENT_SUCCESS,
    {
        amount: number
        paidAmount: number
        studentName: string
    },
    {
        entityId: string;
    }
>

export type STUDENT_ABSENT = NotificationBase<
    NOTIFICATION_ENUM.STUDENT_ABSENT,
    {
        className: string
        studentName: string
        date: string
    },
    {
        entityId: string
    }
>

export type STUDENT_LATE = NotificationBase<
    NOTIFICATION_ENUM.STUDENT_LATE,
    {
        className: string
        studentName: string
        date: string
    },
    {
        entityId: string
    }
>

export type CLASS_REMINDER = NotificationBase<
    NOTIFICATION_ENUM.CLASS_REMINDER,
    {
        className: string
        date: Date
        duration: string
    },
    {
        entityId: string
    }
>


