import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, SoftRemoveEvent, UpdateEvent } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { isArray, isEqual } from 'lodash';
import { AuditLogService } from '@/modules/audit-log/audit-log.service';
import { AuditLog } from '@/modules/audit-log/audit-log.domain';
import { AuditLogMapper } from '@/modules/audit-log/audit-log.mapper';

@EventSubscriber()
@Injectable()
export class AuditSubscriber implements EntitySubscriberInterface {
    private auditLogQueue: AuditLog[] = []
    listenTo(): Function | string {
        return Object;
    }

    async afterInsert(event: InsertEvent<any>) {
        if (event.entity) {
            const user = ClsServiceManager.getClsService().get('user');
            const method = ClsServiceManager.getClsService().get('method');
            const path = ClsServiceManager.getClsService().get('path');

            const changesFields = this.getChangedFields(null, event.entity);

            ClsServiceManager.getClsService().set('log', {
                user: {
                    id: user?.id,
                    email: user?.email,
                    name: user?.name,
                    role: user?.role?.name
                },
                entityName: event.metadata.name,
                entityId: event.entityId.toString(),
                method,
                path,
                changedFields: Object.keys(changesFields),
                newValue: Object.values(changesFields).map(item => item.newValue),
                oldValue: Object.values(changesFields).map(item => item.oldValue)
            })

        }
    }

    private getChangedFields(oldEntity: any, newEntity: any): Record<string, { oldValue: any, newValue: any }> {
        const changes: Record<string, { oldValue: any, newValue: any }> = {};
        const skipFields = ['createdAt', 'updatedAt', 'deletedAt', 'refreshToken', 'password', 'id']
        for (const key in newEntity) {
            if (skipFields.includes(key) || newEntity[key] === undefined) continue;
            const oldValue = oldEntity && oldEntity[key] || null;
            const newValue = newEntity && newEntity[key] || null;

            if (!isEqual(oldValue, newValue) && newValue) {
                changes[key] = {
                    oldValue: oldValue,
                    newValue: newValue
                };
            }
        }

        return changes;
    }

}