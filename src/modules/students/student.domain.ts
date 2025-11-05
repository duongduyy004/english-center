import { Parent } from "modules/parents/parent.domain";
import { User } from "modules/users/user.domain";
import { Class } from "modules/classes/class.domain";

export class Student extends User {

    parent?: Partial<Parent>

    classes?: {
        discountPercent: number,
        class: Partial<Class>,
        isActive: boolean
    }[]
}