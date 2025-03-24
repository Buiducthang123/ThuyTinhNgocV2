export enum EPaymentMethod {
    COD = 1, // Thanh toán khi nhận hàng
    BANK_TRANSFER = 2, // Chuyển khoản
}

export const EPaymentMethodText: Record<EPaymentMethod,string> = {
    [EPaymentMethod.COD]: 'Thanh toán khi nhận hàng',
    [EPaymentMethod.BANK_TRANSFER]: 'Thanh toán VnPay',
}