import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { AdminUserSeedService } from './admin/admin-user-seed.service';
import { SeedModule } from './seed.module';
import { ClassSeedService } from './class/class-seed.service';
import { StudentSeedService } from './student/student-seed.service';
import { TeacherSeedService } from './teacher/teacher-seed.service';
import { ParentSeedService } from './parent/parent-seed.service';
import { MenuSeedService } from './menu/menu-seed.service';
import { PermissionSeedService } from './permission/permission-seed.service';

const runSeed = async () => {
    const app = await NestFactory.create(SeedModule);

    // run seeds in order
    console.log('Seeding roles...');
    await app.get(RoleSeedService).run();

    console.log('Seeding admin user...');
    await app.get(AdminUserSeedService).run();

    console.log('Seeding classes...');
    await app.get(ClassSeedService).run();

    console.log('Seeding students...')
    await app.get(StudentSeedService).run();

    console.log('Seeding teachers...')
    await app.get(TeacherSeedService).run();

    console.log('Seeding parents...')
    await app.get(ParentSeedService).run();

    console.log('Seeding menus...')
    await app.get(MenuSeedService).run();

    console.log('Seeding permission...')
    await app.get(PermissionSeedService).run();

    console.log('Seeding completed successfully!');
    await app.close();
};

void runSeed();
