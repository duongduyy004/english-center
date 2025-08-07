import { Student } from "modules/students/student.domain";
import { User } from "modules/users/user.domain";

export class Parent extends User {
    students: Partial<Student>[]
}