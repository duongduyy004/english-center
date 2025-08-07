import { Student } from "modules/students/student.domain";
import { Parent } from "../parent.domain";

export class addChildDto {
    studentId: Student['id'];

    parentId: Parent['id'];
}