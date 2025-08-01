import { SessionEntity } from "./entities/session.entity";
import { Session } from "./session.domain";


export class SessionMapper {
    static toDomain(raw: SessionEntity): Session {
        const domainEntity = new Session();
        domainEntity.id = raw.id;
        domainEntity.date = raw.date;
        if (raw.attendances) {
            domainEntity.attendances = raw.attendances.map(item => ({
                status: item.status,
                student: {
                    id: item.student.id,
                    name: item.student.name,
                    email: item.student.email,
                    phone: item.student.phone
                },
                isModified: item?.isModified,
                note: item?.note
            }))
        }
        if (raw.class) {
            domainEntity.class = {
                id: raw.class.id,
                name: raw.class.name,
                grade: raw.class.grade,
                section: raw.class.section
            }
        }

        return domainEntity;
    }

    static toPersistence(domainEntity: Session): SessionEntity {
        const persistenceEntity = new SessionEntity();
        if (domainEntity.id && typeof domainEntity.id === 'number') {
            persistenceEntity.id = domainEntity.id;
        }
        persistenceEntity.date = domainEntity.date;
        return persistenceEntity;
    }
}