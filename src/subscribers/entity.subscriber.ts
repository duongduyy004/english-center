import { DataSource, EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { AuditLogService } from '@/modules/audit-log/audit-log.service';
import { Injectable } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { isEqual } from 'lodash';

@EventSubscriber()
@Injectable()
export class AuditSubscriber implements EntitySubscriberInterface {
    private auditDataMap = new WeakMap<any, { originalEntity: any, changes: { fieldName: string, oldValue: string, newValue: string }[], entityName: string }>();

    listenTo(): Function | string {
        return Object;
    }

    async beforeUpdate(event: UpdateEvent<any>) {
        if (event.entity && event.databaseEntity) {
            const changes = this.getChangedFields(event.databaseEntity, event.entity);
            // Store audit data using WeakMap
            const changesList = []

            for (const key in changes) {
                changesList.push({
                    fieldName: key,
                    oldValue: changes[key].oldValue,
                    newValue: changes[key].newValue
                })
            }

            this.auditDataMap.set(event.entity, {
                originalEntity: event.databaseEntity,
                changes: changesList,
                entityName: event.metadata.name,
            });

            const auditData = this.auditDataMap.get(event.entity);

            if (auditData.changes) {
                ClsServiceManager.getClsService().set('auditData', auditData)
            }
        }
    }

    private getChangedFields(oldEntity: any, newEntity: any): Record<string, { oldValue: any, newValue: any }> {
        const changes: Record<string, { oldValue: any, newValue: any }> = {};
        const skipFields = ['updatedAt', 'createdAt', 'deletedAt']
        for (const key in newEntity) {
            if (skipFields.includes(key) || newEntity[key] === undefined) continue;
            const oldValue = oldEntity[key];
            const newValue = newEntity[key];
            if (!isEqual(oldValue, newValue) && oldValue && newValue) {
                changes[key] = {
                    oldValue: oldEntity[key],
                    newValue: newEntity[key]
                };
            }
        }

        return changes;
    }

}