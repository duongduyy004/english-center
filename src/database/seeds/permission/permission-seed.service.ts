import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '@/modules/permissions/entities/permission.entity';

// Basic list of RESTful endpoints across modules. Adjust manually if controllers change.
// Each permission is defined by unique path + method combination.
// Description kept human-readable for admin UI.

interface SeedPermission {
    path: string;
    method: string;
    description: string;
    module: string;
}

@Injectable()
export class PermissionSeedService {
    constructor(
        @InjectRepository(PermissionEntity)
        private repository: Repository<PermissionEntity>,
    ) { }

    private permissions: SeedPermission[] = [
        // User (singular controller base path is /user)
        { path: '/user/admin', method: 'POST', description: 'Create admin user', module: 'user' },
        { path: '/user/avatar', method: 'PATCH', description: 'Upload user avatar', module: 'user' },

        // Roles (kept simple – only list implemented elsewhere)
        { path: '/roles', method: 'GET', description: 'List roles', module: 'role' },

        // Permissions CRUD
        { path: '/permissions', method: 'GET', description: 'List permissions', module: 'permission' },
        { path: '/permissions', method: 'POST', description: 'Create permission', module: 'permission' },
        { path: '/permissions/:id', method: 'GET', description: 'Get permission detail', module: 'permission' },
        { path: '/permissions/:id', method: 'PATCH', description: 'Update permission', module: 'permission' },
        { path: '/permissions/:id', method: 'DELETE', description: 'Delete permission', module: 'permission' },

        // Teachers
        { path: '/teachers', method: 'GET', description: 'List teachers', module: 'teacher' },
        { path: '/teachers', method: 'POST', description: 'Create teacher', module: 'teacher' },
        { path: '/teachers/schedule/:id', method: 'GET', description: 'Get teacher schedule', module: 'teacher' },
        { path: '/teachers/:id', method: 'GET', description: 'Get teacher detail', module: 'teacher' },
        { path: '/teachers/:id', method: 'PATCH', description: 'Update teacher', module: 'teacher' },
        { path: '/teachers/:id', method: 'DELETE', description: 'Delete teacher', module: 'teacher' },

        // Students
        { path: '/students', method: 'GET', description: 'List students', module: 'student' },
        { path: '/students', method: 'POST', description: 'Create student', module: 'student' },
        { path: '/students/schedule/:id', method: 'GET', description: 'Get student schedule', module: 'student' },
        { path: '/students/:id', method: 'GET', description: 'Get student detail', module: 'student' },
        { path: '/students/:id', method: 'PATCH', description: 'Update student', module: 'student' },
        { path: '/students/:id', method: 'DELETE', description: 'Delete student', module: 'student' },

        // Parents
        { path: '/parents', method: 'GET', description: 'List parents', module: 'parent' },
        { path: '/parents', method: 'POST', description: 'Create parent', module: 'parent' },
        { path: '/parents/add-child', method: 'PATCH', description: 'Add child to parent', module: 'parent' },
        { path: '/parents/remove-child', method: 'PATCH', description: 'Remove child from parent', module: 'parent' },
        { path: '/parents/:id', method: 'GET', description: 'Get parent detail', module: 'parent' },
        { path: '/parents/:id', method: 'PATCH', description: 'Update parent', module: 'parent' },
        { path: '/parents/:id', method: 'DELETE', description: 'Delete parent', module: 'parent' },

        // Classes
        { path: '/classes', method: 'GET', description: 'List classes', module: 'class' },
        { path: '/classes', method: 'POST', description: 'Create class', module: 'class' },
        { path: '/classes/assign-teacher', method: 'PATCH', description: 'Assign teacher to class', module: 'class' },
        { path: '/classes/unassign-teacher', method: 'PATCH', description: 'Unassign teacher from class', module: 'class' },
        { path: '/classes/available-students/:id', method: 'GET', description: 'List available students for class', module: 'class' },
        { path: '/classes/add-students/:id', method: 'PATCH', description: 'Add students to class', module: 'class' },
        { path: '/classes/remove-students/:id', method: 'PATCH', description: 'Remove students from class', module: 'class' },
        { path: '/classes/:id', method: 'GET', description: 'Get class detail', module: 'class' },
        { path: '/classes/:id', method: 'PATCH', description: 'Update class', module: 'class' },

        // Sessions
        { path: '/sessions/today/:classId', method: 'GET', description: 'Get today session by class', module: 'session' },
        { path: '/sessions/student/:studentId', method: 'GET', description: 'Get student attendance', module: 'session' },
        { path: '/sessions/all/:classId', method: 'GET', description: 'Get class attendance history', module: 'session' },
        { path: '/sessions/:sessionId', method: 'PATCH', description: 'Update attendance session', module: 'session' },

        // Payments
        { path: '/payments/all', method: 'GET', description: 'List all payments', module: 'payment' },
        { path: '/payments/students/:studentId', method: 'GET', description: 'List payments by student', module: 'payment' },
        { path: '/payments/pay-student/:paymentId', method: 'PATCH', description: 'Pay student invoice', module: 'payment' },

        // Teacher Payments
        { path: '/teacher-payments', method: 'GET', description: 'List teacher payments', module: 'teacherPayment' },
        { path: '/teacher-payments', method: 'POST', description: 'Create teacher payment', module: 'teacherPayment' },
        { path: '/teacher-payments/:id', method: 'PATCH', description: 'Update teacher payment', module: 'teacherPayment' },
        { path: '/teacher-payments/:id', method: 'DELETE', description: 'Delete teacher payment', module: 'teacherPayment' },
        { path: '/teacher-payments/:id', method: 'GET', description: 'Get teacher payment detail', module: 'teacherPayment' },

        // Advertisements
        { path: '/advertisements', method: 'GET', description: 'List advertisements', module: 'advertisement' },
        { path: '/advertisements', method: 'POST', description: 'Create advertisement', module: 'advertisement' },
        { path: '/advertisements/:id', method: 'GET', description: 'Get advertisement detail', module: 'advertisement' },
        { path: '/advertisements/:id', method: 'PATCH', description: 'Update advertisement', module: 'advertisement' },
        { path: '/advertisements/:id', method: 'DELETE', description: 'Delete advertisement', module: 'advertisement' },

        // Introduction
        { path: '/introduction', method: 'GET', description: 'List introduction items', module: 'introduction' },
        { path: '/introduction', method: 'POST', description: 'Create introduction item', module: 'introduction' },
        { path: '/introduction/key/:key', method: 'GET', description: 'Get introduction by key', module: 'introduction' },
        { path: '/introduction/:id', method: 'GET', description: 'Get introduction detail', module: 'introduction' },
        { path: '/introduction/:id', method: 'PATCH', description: 'Update introduction item', module: 'introduction' },
        { path: '/introduction/:id', method: 'DELETE', description: 'Delete introduction item', module: 'introduction' },

        // Feedback
        { path: '/feedback', method: 'GET', description: 'List feedback', module: 'feedback' },
        { path: '/feedback', method: 'POST', description: 'Create feedback', module: 'feedback' },
        { path: '/feedback/:id', method: 'GET', description: 'Get feedback detail', module: 'feedback' },
        { path: '/feedback/:id', method: 'PATCH', description: 'Update feedback', module: 'feedback' },
        { path: '/feedback/:id', method: 'DELETE', description: 'Delete feedback', module: 'feedback' },

        // Transactions
        { path: '/transactions', method: 'GET', description: 'List transactions', module: 'transaction' },
        { path: '/transactions', method: 'POST', description: 'Create transaction', module: 'transaction' },
        { path: '/transactions/:id', method: 'GET', description: 'Get transaction detail', module: 'transaction' },
        { path: '/transactions/:id', method: 'PATCH', description: 'Update transaction', module: 'transaction' },
        { path: '/transactions/:id', method: 'DELETE', description: 'Delete transaction', module: 'transaction' },

        // Transaction Categories
        { path: '/transactions-category', method: 'GET', description: 'List transaction categories', module: 'transactionCategory' },
        { path: '/transactions-category', method: 'POST', description: 'Create transaction category', module: 'transactionCategory' },
        { path: '/transactions-category/:id', method: 'GET', description: 'Get transaction category detail', module: 'transactionCategory' },
        { path: '/transactions-category/:id', method: 'PATCH', description: 'Update transaction category', module: 'transactionCategory' },
        { path: '/transactions-category/:id', method: 'DELETE', description: 'Delete transaction category', module: 'transactionCategory' },

        // Audit Log
        { path: '/audit-log', method: 'GET', description: 'List audit logs', module: 'auditLog' },

        // Dashboard
        { path: '/dashboard/admin', method: 'GET', description: 'Get admin dashboard', module: 'dashboard' },
        { path: '/dashboard/teacher/:teacherId', method: 'GET', description: 'Get teacher dashboard', module: 'dashboard' },
        { path: '/dashboard/student/:studentId', method: 'GET', description: 'Get student dashboard', module: 'dashboard' },
        { path: '/dashboard/parent/:parentId', method: 'GET', description: 'Get parent dashboard', module: 'dashboard' },

        // Menus
        { path: '/menus', method: 'GET', description: 'List menus', module: 'menu' },
        { path: '/menus', method: 'POST', description: 'Create menu', module: 'menu' },
        { path: '/menus/:id', method: 'PATCH', description: 'Update menu', module: 'menu' },
        { path: '/menus/:id', method: 'DELETE', description: 'Delete menu', module: 'menu' },

        // Files (public upload/delete)
        { path: '/files', method: 'POST', description: 'Upload file', module: 'file' },
        { path: '/files', method: 'DELETE', description: 'Delete file', module: 'file' }
    ];

    async run() {
        for (const perm of this.permissions) {
            const exists = await this.repository.count({
                where: { path: perm.path, method: perm.method }
            });
            if (!exists) {
                await this.repository.save(
                    this.repository.create({ ...perm, module: perm.module.toUpperCase(), version: 1 }),
                    { listeners: false }
                );
            }
        }
    }
}
