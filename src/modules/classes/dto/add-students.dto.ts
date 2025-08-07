import { Student } from "modules/students/student.domain";

export class AddStudentsDto {
    studentId: Student['id'];
    discountPercent: number;
}