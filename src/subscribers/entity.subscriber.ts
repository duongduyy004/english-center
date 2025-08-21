import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, SoftRemoveEvent, UpdateEvent } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { isArray, isEqual } from 'lodash';
import { AuditLogService } from '@/modules/audit-log/audit-log.service';

@EventSubscriber()
@Injectable()
export class AuditSubscriber implements EntitySubscriberInterface {
    constructor(private auditLogService: AuditLogService) { }
    private auditLogQueue = []
    listenTo(): Function | string {
        return Object;
    }

    async afterInsert(event: InsertEvent<any>) {
        if (event.entity) {
            const user = ClsServiceManager.getClsService().get('user');
            const method = ClsServiceManager.getClsService().get('method');
            const path = ClsServiceManager.getClsService().get('path');
            // const log = this.auditLogService.create({
            //     user:{
            //         id: user?.id,
            //         email: user?.email,
            //         name:user?.name,
            //         role:user?.role?.name
            //     },
            //     entityName:event.metadata.name,
            //     entityId:event.entityId.toString(),
            //     method,
            //     path,
            //     changedFields:e
            // })
        }
    }

    private getChangedFields(oldEntity: any, newEntity: any): Record<string, { oldValue: any, newValue: any }> {
        const changes: Record<string, { oldValue: any, newValue: any }> = {};
        const skipFields = ['createdAt', 'updatedAt', 'deletedAt']
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