import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ){}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const newPermission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(newPermission);
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async findOne(id: number): Promise<Permission | null> {
    return await this.permissionRepository.findOneBy({id});
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission | null>{
    await this.permissionRepository.update(id, updatePermissionDto);
    return await this.permissionRepository.findOneBy({id});

  }

  async remove(id: number): Promise<{id: number} | null> {
    const result = await this.permissionRepository.delete(id);
    if(result.affected){
      return{id};
    }
    return null;
  }
}
