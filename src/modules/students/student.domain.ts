import { Parent } from "@/modules/parents/parent.domain";
import { User } from "@/modules/users/user.domain";

export class Student extends User {
    parent: Parent
}