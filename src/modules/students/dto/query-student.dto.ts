import { Student } from "../student.domain";

export class FilterStudentDto {
    name?: string;
    email?: string;
}

export class SortStudentDto {
    orderBy: keyof Student;
    order: 'ASC' | 'DESC';
}
