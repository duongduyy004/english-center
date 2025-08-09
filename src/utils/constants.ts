export const PASSWORD_REGEX = new RegExp('^(?=.*[A-Za-z])(?=.*\d).{8,}$')
export enum Actions {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete'
}