export class ConfirmDto {
    id: number;                 // ID giao dịch trên SePay
    gateway: string;            // Brand name của ngân hàng
    transactionDate: string;    // Thời gian xảy ra giao dịch phía ngân hàng
    accountNumber: string;      // Số tài khoản ngân hàng
    code?: string | null;       // Mã code thanh toán (nullable)
    content: string;            // Nội dung chuyển khoản
    transferType: 'in' | 'out'; // Loại giao dịch. 'in' là tiền vào, 'out' là tiền ra
    transferAmount: number;     // Số tiền giao dịch
    accumulated: number;        // Số dư tài khoản (lũy kế)
    subAccount?: string | null; // Tài khoản ngân hàng phụ (nullable)
    referenceCode: string;      // Mã tham chiếu của tin nhắn sms
    description: string;        // Toàn bộ nội dung tin nhắn sms
}
