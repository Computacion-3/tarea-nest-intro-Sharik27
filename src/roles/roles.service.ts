import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Permission } from 'src/permissions/entities/permission.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private permissionsService: PermissionsService,
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const newRole = this.roleRepository.create(createRoleDto);
        return await this.roleRepository.save(newRole);
    }

    async findAll(): Promise<Role[]> {
        return await this.roleRepository.find();
    }

    async findOne(id: number): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ id });
    }

    async update(
        id: number,
        updateRoleDto: UpdateRoleDto,
    ): Promise<Role | null> {
        await this.roleRepository.update(id, updateRoleDto);
        return await this.roleRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<{ id: number } | null> {
        const result = await this.roleRepository.delete(id);
        if (result.affected) {
            return { id };
        }
        return null;
    }

    async findByName(name: string): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ name });
    }

    async assignPermissionToRole(roleId: number, permissionId: number): Promise<Role | null> {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
        });
        
        if (!role) {
            throw new Error('Role not found');
        }

        const permission = await this.permissionsService.findOne(permissionId);
        if (!permission) {
            throw new Error('Permission not found');
        }

        const hasPermission = role.permissions.some(p => p.id === permissionId);
        if (hasPermission) {
            throw new Error('Permission already assigned to role');
        }

        role.permissions.push(permission);
        return await this.roleRepository.save(role);
    }

    async removePermissionFromRole(roleId: number, permissionId: number): Promise<Role | null> {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
        });
        
        if (!role) {
            throw new Error('Role not found');
        }

        role.permissions = role.permissions.filter(p => p.id !== permissionId);
        return await this.roleRepository.save(role);
    }


    async getRolePermissions(id: number): Promise<Permission[]> {
        const role = await this.roleRepository.findOne({
            where: { id },
        });
        
        if (!role) {
            throw new Error('Role not found');
        }

        return role.permissions;
    }
}
