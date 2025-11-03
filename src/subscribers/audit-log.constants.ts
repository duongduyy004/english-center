export enum AuditLogAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE'
}

export const SKIP_FIELDS = ['createdAt', 'updatedAt', 'deletedAt', 'refreshToken', 'password', 'id', 'role']