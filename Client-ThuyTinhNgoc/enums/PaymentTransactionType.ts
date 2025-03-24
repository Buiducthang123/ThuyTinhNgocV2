export const enum EPaymentTransactionType {
    DEPOSIT = 1, // Nap tien 
    REFUND = 2 // Hoan tien
}

export const EPaymentTransactionTypeText: Record<EPaymentTransactionType,string> = {
    [EPaymentTransactionType.DEPOSIT]: 'Nạp tiền',
    [EPaymentTransactionType.REFUND]: 'Hoàn tiền',
}
