import { Teacher } from "@/modules/teachers/teacher.domain";
import { Student } from "../students/student.domain";

export class Schedule {
    start_date: Date;
    end_date: Date;
    days_of_week: string[];
    time_slots: TimeSlots;
}

export class TimeSlots {
    start_time: string;
    end_time: string;
}

export class Class {
    id: number;
    name: string;
    grade: number;
    section: number;
    year: number;
    description?: string;
    feePerLesson: number;
    status: 'active' | 'upcoming' | 'closed';
    max_student: number;
    room: string;
    schedule: Schedule;
    students?: {
        discountPercent: number,
        student: Partial<Student>
    }[];
    teacher?: Partial<Teacher>
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}