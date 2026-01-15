import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DataSource } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from '@/modules/permissions/entities/permission.entity';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'config/config.type';

const CACHE_PREFIX = 'role_permissions';

@Injectable()
export class PermissionCacheService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private dataSource: DataSource,
        private configService: ConfigService<AllConfigType>,
    ) { }

    /**
     * Get cache key for a role
     */
    private getCacheKey(roleId: number): string {
        return `${CACHE_PREFIX}:${roleId}`;
    }

    /**
     * Get permissions for a role from cache or database
     * If not in cache, query database and store in cache
     */
    async getPermissions(roleId: number): Promise<PermissionEntity[]> {
        const CACHE_TTL = this.configService.get('app.cacheTTL', { infer: true });
        const cacheKey = this.getCacheKey(roleId);

        // Try to get from cache first
        const cachedPermissions = await this.cacheManager.get<PermissionEntity[]>(cacheKey);
        if (cachedPermissions) {
            return cachedPermissions;
        }

        // Query from database if not in cache
        const role = await this.dataSource.getRepository(RoleEntity).findOne({
            where: { id: roleId },
            relations: ['permissions'],
        });

        const permissions = role?.permissions || [];

        // Store in cache
        await this.cacheManager.set(cacheKey, permissions, CACHE_TTL);

        return permissions;
    }

    /**
     * Invalidate cache for a specific role
     * Should be called when role is updated or deleted
     */
    async invalidateRole(roleId: number): Promise<void> {
        const cacheKey = this.getCacheKey(roleId);
        await this.cacheManager.del(cacheKey);
    }
}
