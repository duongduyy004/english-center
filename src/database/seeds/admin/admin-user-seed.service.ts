import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { RoleEntity } from '@/modules/roles/entities/role.entity';
import { RoleEnum } from '@/modules/roles/roles.enum';

@Injectable()
export class AdminUserSeedService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
    ) { }

    async run() {
        const adminRole = await this.roleRepository.findOne({
            where: { id: RoleEnum.admin }
        });

        if (!adminRole) {
            throw new Error('Admin role not found. Please ensure roles are seeded first.');
        }

        const existingAdmin = await this.userRepository.findOne({
            where: { email: 'admin@gmail.com' }
        });

        if (!existingAdmin) {

            const admin = this.userRepository.create({
                name: 'System Administrator',
                email: 'admin@gmail.com',
                password: 'password123',
                gender: 'Male',
                dayOfBirth: new Date('1990-01-01'),
                address: 'System Address',
                phone: '1234567890',
                role: adminRole,
            });

            await this.userRepository.save(admin);
            console.log('Default admin user created successfully');
            console.log('Email: admin@gmail.com');
            console.log('Password: password123');
        } else {
            console.log('Admin user already exists');
        }
    }
}
