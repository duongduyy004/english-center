import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, SoftRemoveEvent, UpdateEvent } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import _, { capitalize, isArray, isEqual } from 'lodash';
import { AuditLog } from '@/modules/audit-log/audit-log.domain';
import { AuditLogAction, SKIP_FIELDS } from './audit-log.constants';

@EventSubscriber()
@Injectable()
export class AuditSubscriber implements EntitySubscriberInterface {
    private auditLogQueue: AuditLog[] = []
    listenTo(): Function | string {
        return Object;
    }

    async afterInsert(event: InsertEvent<any>) {
        if (event.metadata.name === 'AttendanceSessionEntity') return;
        if (event.entity) {
            const user = ClsServiceManager.getClsService().get('user');
            const method = ClsServiceManager.getClsService().get('method');
            const path = ClsServiceManager.getClsService().get('path');

            const changesFields = this.getChangedFields(null, event.entity);
            const newValue: Record<string, any> = {};
            const oldValue: Record<string, any> = {};
            for (const key of Object.keys(changesFields)) {
                newValue[key] = changesFields[key].newValue;
                oldValue[key] = changesFields[key].oldValue;
            }

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
                newValue,
                oldValue,
                action: AuditLogAction.CREATE
            })
        }
    }

    async beforeUpdate(event: UpdateEvent<any>) {
        if (event.entity && event.databaseEntity) {
            const user = ClsServiceManager.getClsService().get('user');
            const method = ClsServiceManager.getClsService().get('method');
            const path = ClsServiceManager.getClsService().get('path');

            const changesFields = this.getChangedFields(event.databaseEntity, event.entity);
            const newValue: Record<string, any> = {};
            const oldValue: Record<string, any> = {};
            for (const key of Object.keys(changesFields)) {
                newValue[key] = changesFields[key].newValue;
                oldValue[key] = changesFields[key].oldValue;
            }

            ClsServiceManager.getClsService().set('log', {
                user: {
                    id: user?.id,
                    email: user?.email,
                    name: user?.name,
                    role: user?.role?.name
                },
                entityName: event.metadata.name,
                entityId: event.entity.id,
                method,
                path,
                changedFields: Object.keys(changesFields),
                newValue,
                oldValue,
                action: AuditLogAction.UPDATE
            })
        }
    }

    async beforeSoftRemove(event: SoftRemoveEvent<any>) {
        if (event.databaseEntity) {
            const user = ClsServiceManager.getClsService().get('user');
            const method = ClsServiceManager.getClsService().get('method');
            const path = ClsServiceManager.getClsService().get('path');

            const changesFields = this.getChangedFields(event.databaseEntity, null);
            const newValue: Record<string, any> = {};
            const oldValue: Record<string, any> = {};
            for (const key of Object.keys(changesFields)) {
                newValue[key] = changesFields[key].newValue;
                oldValue[key] = changesFields[key].oldValue;
            }

            ClsServiceManager.getClsService().set('log', {
                user: {
                    id: user?.id,
                    email: user?.email,
                    name: user?.name,
                    role: user?.role?.name
                },
                entityName: event.metadata.name,
                entityId: event.entity.id,
                method,
                path,
                changedFields: Object.keys(changesFields),
                newValue,
                oldValue,
                action: AuditLogAction.DELETE
            })
        }
    }

    private getChangedFields(oldEntity: any, newEntity: any): Record<string, { oldValue: any, newValue: any }> {
        const changes: Record<string, { oldValue: any, newValue: any }> = {};

        // if trigger insert
        if (!oldEntity && newEntity) {
            newEntity = this.convertNestedObject(newEntity)
            for (const key in newEntity) {
                if (SKIP_FIELDS.includes(key) || newEntity[key] === undefined || null) continue;
                changes[key] = {
                    oldValue: null,
                    newValue: newEntity[key]
                }
            }
            return changes;
        }

        // if trigger soft remove
        if (oldEntity && !newEntity) {
            oldEntity = this.convertNestedObject(oldEntity);
            for (const key in oldEntity) {
                if (SKIP_FIELDS.includes(key) || oldEntity[key] === undefined || null) continue;
                changes[key] = {
                    oldValue: oldEntity[key],
                    newValue: null
                }
            }
            return changes;
        }

        // if trigger udpate
        if (oldEntity && newEntity) {
            oldEntity = this.convertNestedObject(oldEntity);
            newEntity = this.convertNestedObject(newEntity)
            for (const key in newEntity) {
                if (SKIP_FIELDS.includes(key) || newEntity[key] === undefined || null) continue;
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

    private convertNestedObject(object: Object, parentKey = '', result = {}) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const newKey = parentKey ? `${parentKey}${capitalize(key)}` : key;
                if (typeof object[key] === 'object' && object[key] !== null && !Array.isArray(object[key])) {
                    this.convertNestedObject(object[key], newKey, result);
                } else {
                    result[newKey] = object[key];
                }
            }
        }
        return result;
    }

}