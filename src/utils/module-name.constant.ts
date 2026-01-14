export const MODULE_NAME_MAP: Record<string, string> = {
    'user': 'Nhân viên',
    'students': 'Học viên',
    'parents': 'Phụ huynh',
    'teachers': 'Giáo viên',
    'classes': 'Lớp học',
    'payments': 'Thanh toán học phí',
    'sessions': 'Buổi học',
    'teacher-payments': 'Thanh toán giáo viên',
    'auth': 'Xác thực',
    'menus': 'Menu',
    'transactions': 'Giao dịch',
    'transactions-category': 'Danh mục giao dịch',
    'registrations': 'Đăng ký',
    'files': 'Tệp tin',
    'advertisements': 'Quảng cáo',
    'dashboard': 'Bảng điều khiển',
    'feedback': 'Phản hồi',
    'articles': 'Bài viết',
    'footer-settings': 'Cài đặt footer',
    'notifications': 'Thông báo',
    'roles': 'Vai trò',
    'permissions': 'Quyền hạn',
};

export function getModuleNameVi(moduleKey: string): string {
    return MODULE_NAME_MAP[moduleKey.toLowerCase()] || moduleKey;
}
