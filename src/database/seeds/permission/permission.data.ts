export const permission_data = {
    "user": [
        {
            "path": "/api/v1/user",
            "method": "POST",
            "description": "Tạo mới nhân viên"
        },
        {
            "path": "/api/v1/user",
            "method": "GET",
            "description": "Lấy danh sách nhân viên"
        },
        {
            "path": "/api/v1/user/:id",
            "method": "GET",
            "description": "Lấy chi tiết nhân viên"
        },
        {
            "path": "/api/v1/user/:id",
            "method": "PATCH",
            "description": "Cập nhật nhân viên"
        },
        {
            "path": "/api/v1/user/:id",
            "method": "DELETE",
            "description": "Xóa nhân viên"
        },
    ],
    "students": [
        {
            "path": "/api/v1/students",
            "method": "POST",
            "description": "Tạo mới học viên"
        },
        {
            "path": "/api/v1/students",
            "method": "GET",
            "description": "Lấy danh sách học viên"
        },
        {
            "path": "/api/v1/students/statistics",
            "method": "GET",
            "description": "Lấy thống kê học viên"
        },
        {
            "path": "/api/v1/students/schedule/:id",
            "method": "GET",
            "description": "Lấy lịch học của học viên"
        },
        {
            "path": "/api/v1/students/:id",
            "method": "GET",
            "description": "Lấy chi tiết học viên"
        },
        {
            "path": "/api/v1/students/:id",
            "method": "PATCH",
            "description": "Cập nhật thông tin học viên"
        },
        {
            "path": "/api/v1/students/:id",
            "method": "DELETE",
            "description": "Xóa học viên"
        }
    ],
    "parents": [
        {
            "path": "/api/v1/parents",
            "method": "POST",
            "description": "Tạo mới phụ huynh"
        },
        {
            "path": "/api/v1/parents",
            "method": "GET",
            "description": "Lấy danh sách phụ huynh"
        },
        {
            "path": "/api/v1/parents/add-child",
            "method": "PATCH",
            "description": "Thêm học viên vào tài khoản phụ huynh"
        },
        {
            "path": "/api/v1/parents/remove-child",
            "method": "PATCH",
            "description": "Xóa học viên khỏi tài khoản phụ huynh"
        },
        {
            "path": "/api/v1/parents/:id",
            "method": "GET",
            "description": "Lấy chi tiết phụ huynh"
        },
        {
            "path": "/api/v1/parents/:id",
            "method": "PATCH",
            "description": "Cập nhật thông tin phụ huynh"
        },
        {
            "path": "/api/v1/parents/:id",
            "method": "DELETE",
            "description": "Xóa phụ huynh"
        }
    ],
    "teachers": [
        {
            "path": "/api/v1/teachers",
            "method": "POST",
            "description": "Tạo mới giáo viên"
        },
        {
            "path": "/api/v1/teachers",
            "method": "GET",
            "description": "Lấy danh sách giáo viên"
        },
        {
            "path": "/api/v1/teachers/schedule/:id",
            "method": "GET",
            "description": "Lấy lịch dạy của giáo viên"
        },
        {
            "path": "/api/v1/teachers/:id",
            "method": "GET",
            "description": "Lấy chi tiết giáo viên"
        },
        {
            "path": "/api/v1/teachers/:id",
            "method": "PATCH",
            "description": "Cập nhật thông tin giáo viên"
        },
        {
            "path": "/api/v1/teachers/:id",
            "method": "DELETE",
            "description": "Xóa giáo viên"
        }
    ],
    "classes": [
        {
            "path": "/api/v1/classes",
            "method": "POST",
            "description": "Tạo mới lớp học"
        },
        {
            "path": "/api/v1/classes",
            "method": "GET",
            "description": "Lấy danh sách lớp học"
        },
        {
            "path": "/api/v1/classes/assign-teacher",
            "method": "PATCH",
            "description": "Thêm giáo viên vào lớp học"
        },
        {
            "path": "/api/v1/classes/unassign-teacher",
            "method": "PATCH",
            "description": "Xóa giáo viên khỏi lớp học"
        },
        {
            "path": "/api/v1/classes/available-students/:id",
            "method": "GET",
            "description": "Lấy danh sách học viên có thể thêm vào lớp"
        },
        {
            "path": "/api/v1/classes/add-students/:id",
            "method": "PATCH",
            "description": "Thêm học viên vào lớp học"
        },
        {
            "path": "/api/v1/classes/remove-students/:id",
            "method": "PATCH",
            "description": "Xóa học viên khỏi lớp học"
        },
        {
            "path": "/api/v1/classes/student-status/:id",
            "method": "PATCH",
            "description": "Cập nhật trạng thái học viên trong lớp"
        },
        {
            "path": "/api/v1/classes/:id",
            "method": "GET",
            "description": "Lấy chi tiết lớp học"
        },
        {
            "path": "/api/v1/classes/:id",
            "method": "PATCH",
            "description": "Cập nhật thông tin lớp học"
        }
    ],
    "payments": [
        {
            "path": "/api/v1/payments/all",
            "method": "GET",
            "description": "Lấy danh sách tất cả hóa đơn thanh toán"
        },
        {
            "path": "/api/v1/payments/students/:studentId",
            "method": "GET",
            "description": "Lấy danh sách hóa đơn của học viên"
        },
        {
            "path": "/api/v1/payments/report",
            "method": "GET",
            "description": "Lấy báo cáo và thống kê thanh toán"
        },
        {
            "path": "/api/v1/payments/pay-student/:paymentId",
            "method": "PATCH",
            "description": "Cập nhật trạng thái thanh toán của hóa đơn học viên"
        },
        {
            "path": "/api/v1/payments/qrcode",
            "method": "GET",
            "description": "Lấy thông tin QR Code thanh toán"
        }
    ],
    "sessions": [
        {
            "path": "/api/v1/sessions/today/:classId",
            "method": "GET",
            "description": "Lấy danh sách buổi học của lớp trong ngày"
        },
        {
            "path": "/api/v1/sessions/student/:studentId",
            "method": "GET",
            "description": "Lấy danh sách buổi học của học viên"
        },
        {
            "path": "/api/v1/sessions/all/:classId",
            "method": "GET",
            "description": "Lấy tất cả buổi học của lớp"
        },
        {
            "path": "/api/v1/sessions/:sessionId",
            "method": "PATCH",
            "description": "Cập nhật thông tin buổi học"
        }
    ],
    "teacher-payments": [
        {
            "path": "/api/v1/teacher-payments",
            "method": "GET",
            "description": "Lấy danh sách thanh toán của giáo viên"
        },
        {
            "path": "/api/v1/teacher-payments/report",
            "method": "GET",
            "description": "Lấy báo cáo và thống kê thanh toán giáo viên"
        },
        {
            "path": "/api/v1/teacher-payments/:id",
            "method": "GET",
            "description": "Lấy chi tiết thanh toán của giáo viên"
        },
        {
            "path": "/api/v1/teacher-payments/:id/pay",
            "method": "PATCH",
            "description": "Thanh toán cho giáo viên"
        }
    ],
    "menus": [
        {
            "path": "/api/v1/menus",
            "method": "POST",
            "description": "Tạo mới menu"
        },
        {
            "path": "/api/v1/menus/:id",
            "method": "PATCH",
            "description": "Cập nhật menu"
        },
        {
            "path": "/api/v1/menus/:id",
            "method": "DELETE",
            "description": "Xóa menu"
        }
    ],
    "transactions": [
        {
            "path": "/api/v1/transactions",
            "method": "POST",
            "description": "Tạo giao dịch mới"
        },
        {
            "path": "/api/v1/transactions",
            "method": "GET",
            "description": "Lấy danh sách giao dịch"
        },
        {
            "path": "/api/v1/transactions/report",
            "method": "GET",
            "description": "Lấy báo cáo và thống kê giao dịch"
        },
        {
            "path": "/api/v1/transactions/:id",
            "method": "GET",
            "description": "Lấy chi tiết giao dịch"
        },
        {
            "path": "/api/v1/transactions/:id",
            "method": "PATCH",
            "description": "Cập nhật giao dịch"
        },
        {
            "path": "/api/v1/transactions/:id",
            "method": "DELETE",
            "description": "Xóa giao dịch"
        }
    ],
    "transactions-category": [
        {
            "path": "/api/v1/transactions-category",
            "method": "POST",
            "description": "Tạo danh mục giao dịch"
        },
        {
            "path": "/api/v1/transactions-category",
            "method": "GET",
            "description": "Lấy danh sách danh mục giao dịch"
        },
        {
            "path": "/api/v1/transactions-category/:id",
            "method": "GET",
            "description": "Lấy chi tiết danh mục giao dịch"
        },
        {
            "path": "/api/v1/transactions-category/:id",
            "method": "PATCH",
            "description": "Cập nhật danh mục giao dịch"
        },
        {
            "path": "/api/v1/transactions-category/:id",
            "method": "DELETE",
            "description": "Xóa danh mục giao dịch"
        }
    ],
    "registrations": [
        {
            "path": "/api/v1/registrations",
            "method": "GET",
            "description": "Lấy danh sách đăng ký"
        },
        {
            "path": "/api/v1/registrations/:id",
            "method": "GET",
            "description": "Lấy chi tiết đăng ký"
        },
        {
            "path": "/api/v1/registrations/:id",
            "method": "PATCH",
            "description": "Cập nhật đăng ký"
        },
        {
            "path": "/api/v1/registrations/:id",
            "method": "DELETE",
            "description": "Xóa đăng ký"
        }
    ],
    "files": [
        {
            "path": "/api/v1/files",
            "method": "POST",
            "description": "Tải file lên"
        },
        {
            "path": "/api/v1/files",
            "method": "DELETE",
            "description": "Xóa file"
        }
    ],
    "advertisements": [
        {
            "path": "/api/v1/advertisements",
            "method": "POST",
            "description": "Tạo quảng cáo"
        },
        {
            "path": "/api/v1/advertisements",
            "method": "GET",
            "description": "Lấy danh sách quảng cáo"
        },
        {
            "path": "/api/v1/advertisements/:id",
            "method": "GET",
            "description": "Lấy chi tiết quảng cáo"
        },
        {
            "path": "/api/v1/advertisements/:id",
            "method": "PATCH",
            "description": "Cập nhật quảng cáo"
        },
        {
            "path": "/api/v1/advertisements/:id",
            "method": "DELETE",
            "description": "Xóa quảng cáo"
        }
    ],
    "dashboard": [
        {
            "path": "/api/v1/dashboard/admin",
            "method": "GET",
            "description": "Lấy thông tin dashboard admin"
        },
        {
            "path": "/api/v1/dashboard/teacher/:teacherId",
            "method": "GET",
            "description": "Lấy thông tin dashboard giáo viên"
        },
        {
            "path": "/api/v1/dashboard/student/:studentId",
            "method": "GET",
            "description": "Lấy thông tin dashboard học sinh"
        },
        {
            "path": "/api/v1/dashboard/parent/:parentId",
            "method": "GET",
            "description": "Lấy thông tin dashboard phụ huynh"
        }
    ],
    "feedback": [
        {
            "path": "/api/v1/feedback",
            "method": "POST",
            "description": "Gửi phản hồi"
        },
        {
            "path": "/api/v1/feedback/:id",
            "method": "PATCH",
            "description": "Cập nhật phản hồi"
        },
        {
            "path": "/api/v1/feedback/:id",
            "method": "DELETE",
            "description": "Xóa phản hồi"
        }
    ],
    "articles": [
        {
            "path": "/api/v1/articles",
            "method": "POST",
            "description": "Tạo bài viết"
        },
        {
            "path": "/api/v1/articles/:id",
            "method": "PATCH",
            "description": "Cập nhật bài viết"
        },
        {
            "path": "/api/v1/articles/:id",
            "method": "DELETE",
            "description": "Xóa bài viết"
        }
    ],
    "footer-settings": [
        {
            "path": "/api/v1/footer-settings",
            "method": "POST",
            "description": "Tạo cài đặt footer"
        },
        {
            "path": "/api/v1/footer-settings",
            "method": "PATCH",
            "description": "Cập nhật cài đặt footer"
        }
    ],
    "notifications": [
        {
            "path": "/api/v1/notifications/send",
            "method": "POST",
            "description": "Gửi thông báo"
        },
        {
            "path": "/api/v1/notifications",
            "method": "GET",
            "description": "Lấy danh sách thông báo"
        },
        {
            "path": "/api/v1/notifications/mark-as-read/:notificationId",
            "method": "PATCH",
            "description": "Đánh dấu thông báo đã đọc"
        }
    ]
}