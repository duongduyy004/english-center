export const VN_MAPS = Object.freeze({
  user: {
    id: 'ID',
    name: 'tên',
    email: 'email',
    phone: 'số điện thoại',
    gender: 'giới tính',
    address: 'địa chỉ',
    dayOfBirth: 'ngày sinh',
    avatar: 'ảnh đại diện',
    role: 'vai trò',
    isEmailVerified: 'tình trạng xác thực email',
    note: 'ghi chú',
    isActive: 'tình trạng hoạt động',
  },
  student: {
    id: 'ID',
    name: 'tên',
    email: 'email',
    phone: 'số điện thoại',
    gender: 'giới tính',
    address: 'địa chỉ',
    dayOfBirth: 'ngày sinh',
    avatar: 'ảnh đại diện',
    role: 'vai trò',
    isEmailVerified: 'tình trạng xác thực email',
    parent: 'phụ huynh',
    classes: 'các lớp học'
  },
  parent: {
    id: 'ID',
    name: 'tên',
    email: 'email',
    phone: 'số điện thoại',
    gender: 'giới tính',
    address: 'địa chỉ',
    dayOfBirth: 'ngày sinh',
    avatar: 'ảnh đại diện',
    role: 'vai trò',
    isEmailVerified: 'tình trạng xác thực email',
    students: 'các học sinh'
  },
  classes: {
    discountPercent: 'phần trăm giảm giá',
    class: 'lớp',
    isActive: 'trạng thái'
  },
  class: {
    name: 'tên lớp',
    grade: 'khối',
    section: 'phân lớp',
    year: 'năm',
    description: 'mô tả',
    feePerLesson: 'học phí mỗi buổi',
    status: 'trạng thái',
    max_student: 'số học sinh tối đa',
    room: 'phòng học',
    schedule: 'thời khóa biểu',
    teacher: 'giáo viên',
  },
  schedule: {
    start_date: 'ngày bắt đầu',
    end_date: 'ngày kết thúc',
    days_of_week: 'ngày trong tuần',
    time_slots: 'thời gian'
  },
  time_slots: {
    start_time: 'thời gian bắt đầu',
    end_time: 'thời gian kết thúc'
  },
  registration: {
    processed: 'tình trạng xử lý',
    classId: 'ID lớp',
  },
  teacher: {
    id: 'ID',
    name: 'tên',
    email: 'email',
    phone: 'số điện thoại',
    gender: 'giới tính',
    address: 'địa chỉ',
    dayOfBirth: 'ngày sinh',
    avatar: 'ảnh đại diện',
    role: 'vai trò',
    isEmailVerified: 'tình trạng xác thực email',
    note: 'ghi chú',
    createdAt: 'tạo lúc',
    updatedAt: 'cập nhật lúc',
    deletedAt: 'xóa lúc',
    isActive: 'tình trạng hoạt động',
    qualifications: 'trình độ chuyên môn',
    specializations: 'chuyên ngành',
    salaryPerLesson: 'lương mỗi buổi',
    introduction: 'giới thiệu',
    workExperience: 'kinh nghiệm làm việc',
  },
  payments: {
    id: 'mã hóa đơn',
    month: 'tháng',
    year: 'năm',
    totalLessons: 'tổng số buổi học',
    paidAmount: 'số tiền đã thanh toán',
    discountAmount: 'số tiền giảm',
    totalAmount: 'tổng số tiền',
    status: 'trạng thái',
    student: 'học sinh',
    class: 'lớp',
    histories: 'lịch sử',
    paymentRequests: 'yêu cầu thanh toán'
  },
  histories: {
    amount: 'số tiền',
    method: 'phương thức thanh toán',
    date: 'thời gian',
    note: 'ghi chú'
  },
  paymentRequests: {
    id: 'mã yêu cầu',
    amount: 'số tiền',
    imageProof: 'ảnh minh chứng',
    status: 'trạng thái',
    requestedAt: 'thời gian yêu cầu',
    proccessedAt: 'thời gian xử lý',
    proccessedBy: 'xử lý bởi',
    rejectionReason: 'lý do từ chối'
  },
  transaction: {
    id: 'mã thu chi',
    amount: 'số tiền',
    description: 'mô tả',
    transactionAt: 'thời gian',
    category: 'danh mục'
  },
  category: {
    id: 'mã danh mục',
    type: 'loại',
    name: 'tên danh mục'
  },
  menu: {
    id: 'mã menu',
    slug: 'đường dẫn',
    title: 'tiêu đề',
    order: 'thứ tự',
    isActive: 'trạng thái',
    childrenMenu: 'menu con',
    parentMenu: 'menu cha'
  },
  childrenMenu: {
    id: 'mã menu',
    slug: 'đường dẫn',
    title: 'tiêu đề',
    order: 'thứ tự',
    isActive: 'trạng thái',
    childrenMenu: 'menu con',
    parentMenu: 'menu cha'
  },
  parentMenu: {
    id: 'mã menu',
    slug: 'đường dẫn',
    title: 'tiêu đề',
    order: 'thứ tự',
    isActive: 'trạng thái',
    childrenMenu: 'menu con',
    parentMenu: 'menu cha'
  },
  advertisement: {
    id: "mã quảng cáo",
    title: 'tiêu đề',
    description: 'mô tả',
    type: 'loại',
    priority: 'độ ưu tiên',
    imageUrl: 'đường dẫn ảnh',
    publicId: 'mã công khai',
    class: 'lớp'
  },
  role: {
    id: "mã vai trò",
    name: 'tên vai trò',
    isActive: 'kích hoạt',
    description: 'mô tả'
  }
});

export const VN_TIMESTAMP = Object.freeze({
  createdAt: 'tạo lúc',
  updatedAt: 'cập nhật lúc',
  deletedAt: 'xóa lúc',
})

export const VN_ACTION = Object.freeze({
  CREATE: 'tạo',
  UPDATE: 'cập nhật',
  DELETE: 'xóa',
});

export const VN_ENTITY = Object.freeze({
  ClassEntity: 'lớp',
  StudentEntity: 'học sinh',
  TeacherEntity: 'giáo viên',
  MenuEntity: 'menu',
  ParentEntity: 'phụ huynh',
  UserEntity: 'người dùng',
  PaymentEntity: 'tài chính học sinh',
  TeacherPaymentEntity: 'tài chính giáo viên',
  RegistrationEntity: 'form đăng ký',
  AdvertisementEntity: 'quảng cáo',
  TransactionEntity: 'thu chi khác',
  TransactionCategoryEntity: 'danh mục thu chi',
  PaymentRequestEntity: 'yêu cầu thanh toán',
  IntroductionEntity: 'giới thiệu',
  PermissionEntity: 'quyền hạn',
  RoleEntity: 'vai trò'
});

export const ENTITY_MAP = Object.freeze({
  ClassEntity: 'class',
  ClassStudentEntity: 'class',
  StudentEntity: 'student',
  TeacherEntity: 'teacher',
  MenuEntity: 'menu',
  ParentEntity: 'parent',
  UserEntity: 'user',
  PaymentEntity: 'payments',
  TeacherPaymentEntity: 'teacherPayment',
  RegistrationEntity: 'registration',
  AdvertisementEntity: 'advertisement',
  TransactionEntity: 'transaction',
  TransactionCategoryEntity: 'category',
  PaymentRequestEntity: 'paymentRequests',
  IntroductionEntity: 'introduction',
  PermissionEntity: 'permission',
  RoleEntity: 'role'
})
