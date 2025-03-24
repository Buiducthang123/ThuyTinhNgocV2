export enum ProductTransactionStatus {
    PENDING = 1, // Chờ xác nhận
    SUCCESS = 2, // Thành công
    CANCEL = 3, // Hủy
}

export const ProductTransactionStatusText: Record<ProductTransactionStatus, string> = {
    [ProductTransactionStatus.PENDING]: 'Chờ xác nhận',
    [ProductTransactionStatus.SUCCESS]: 'Thành công',
    [ProductTransactionStatus.CANCEL]: 'Hủy',
}

export enum ProductTransactionType {
    IMPORT = 1, // Nhập sản phẩm
    EXPORT = 2, // Xuất sản phẩm
}

export const ProductTransactionTypeText: Record<ProductTransactionType, string> = {
    [ProductTransactionType.IMPORT]: 'Nhập sản phẩm',
    [ProductTransactionType.EXPORT]: 'Xuất sản phẩm',
}