import { RoleEnum } from "../roles/roles.enum";
import { UserEntity } from "./entities/user.entity";
import { User } from "./user.domain";

export class UserMapper {
    static toDomain(raw: UserEntity): User {
        const domainEntity = new User()
        domainEntity.id = raw.id;
        domainEntity.name = raw.name;
        domainEntity.email = raw.email;
        domainEntity.gender = raw.gender;
        domainEntity.dayOfBirth = raw.dayOfBirth;
        domainEntity.phone = raw.phone;
        domainEntity.address = raw.address;
        domainEntity.role = {
            id: raw.role.id,
            name: RoleEnum[raw.role.id],
            isActive: raw.role.isActive,
            description: raw.role.description
        }

        return domainEntity
    }
}