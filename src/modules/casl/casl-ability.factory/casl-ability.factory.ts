import { Actions } from "@/utils/constants";
import {
    AbilityBuilder,
    ExtractSubjectType,
    InferSubjects,
    createMongoAbility,
    PureAbility
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { ClassEntity } from "@/modules/classes/entities/class.entity";
import { StudentEntity } from "@/modules/students/entities/student.entity";
import { TeacherEntity } from "@/modules/teachers/entities/teacher.entity";
import { ParentEntity } from "@/modules/parents/entities/parent.entity";
import { PaymentEntity } from "@/modules/payments/entities/payment.entity";
import { SessionEntity } from "@/modules/sessions/entities/session.entity";
import { User } from "@/modules/users/user.domain";
import { RoleEnum } from "@/modules/roles/roles.enum";

type Subjects = InferSubjects<
    typeof ClassEntity |
    typeof StudentEntity |
    typeof TeacherEntity |
    typeof ParentEntity |
    typeof PaymentEntity |
    typeof SessionEntity |
    typeof User
> | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User): AppAbility {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

        // Admin permissions
        if (user.role?.id === RoleEnum.admin) {
            can(Actions.Manage, 'all');
        }

        // Teacher permissions
        else if (user.role?.id === RoleEnum.teacher) {
            // Teachers can read their own profile
            can(Actions.Read, TeacherEntity, { id: user.id });
            can(Actions.Update, TeacherEntity, { id: user.id });

            // Teachers can manage their classes
            can(Actions.Read, ClassEntity, { "teacher.teacherId": user.id });
            can(Actions.Update, ClassEntity, { teacherId: user.id });

            // Teachers can read students in their classes
            can(Actions.Read, StudentEntity);

            // Teachers can manage sessions for their classes
            can(Actions.Create, SessionEntity);
            can(Actions.Read, SessionEntity, { 'class.teacherId': user.id });
            can(Actions.Update, SessionEntity, { 'class.teacherId': user.id });

            // Teachers can view their payments
            can(Actions.Read, PaymentEntity, { teacherId: user.id });
        }

        // Student permissions
        else if (user.role?.id === RoleEnum.student) {
            // Students can read/update their own profile
            can(Actions.Read, StudentEntity, { id: user.id });
            can(Actions.Update, StudentEntity, { id: user.id });

            // Students can read their classes
            can(Actions.Read, ClassEntity);

            // Students can read sessions for their classes
            can(Actions.Read, SessionEntity);

            // Students can view their payments
            can(Actions.Read, PaymentEntity, { studentId: user.id });
        }

        // Parent permissions
        else if (user.role?.id === RoleEnum.parent) {
            // Parents can read/update their own profile
            can(Actions.Read, ParentEntity, { id: user.id });
            can(Actions.Update, ParentEntity, { id: user.id });

            // Parents can read their children's information
            // Assuming there's a relationship between parent and students
            can(Actions.Read, StudentEntity, { parentId: user.id });
            can(Actions.Read, ClassEntity);
            can(Actions.Read, SessionEntity);
            can(Actions.Read, PaymentEntity, { 'student.parentId': user.id });
        }

        // Default deny sensitive actions
        cannot(Actions.Delete, 'all');
        cannot(Actions.Manage, User);

        return build({
            detectSubjectType: (item: any) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
