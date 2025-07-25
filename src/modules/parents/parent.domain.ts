import { Student } from "@/modules/users/students/student.domain";
import { User } from "@/modules/users/user.domain";

export class Parent extends User {
    students: Student[]
}