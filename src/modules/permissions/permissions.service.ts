import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './permission.repository';
import { Permission } from './permission.domain';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly i18nService: I18nService,
  ) { }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    // Check if permission with same path and method already exists
    const existingPermission = await this.permissionRepository.findByPath(createPermissionDto.path);
    if (existingPermission && existingPermission.method === createPermissionDto.method) {
      throw new NotFoundException(
        this.i18nService.t('common.ALREADY_EXISTS', {
          args: { entity: 'Permission' },
        }),
      );
    }

    return this.permissionRepository.create(createPermissionDto);
  }

  async findAllGroupedByModule(): Promise<Record<string, Permission[]>> {
    return this.permissionRepository.findAllGroupedByModule();
  }

  async findOne(id: Permission['id']): Promise<Permission> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundException(
        this.i18nService.t('common.NOT_FOUND', {
          args: { entity: 'Permission' },
        }),
      );
    }
    return permission;
  }

  async update(
    id: Permission['id'],
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    await this.findOne(id);
    return this.permissionRepository.update(id, updatePermissionDto);
  }

  async remove(id: Permission['id']): Promise<void> {
    await this.findOne(id);
    return this.permissionRepository.remove(id);
  }
}
