export enum OrderStatus {
    PENDING = 1, // Chờ duyệt
    APPROVED = 2, // Đã duyệt
    PREPARING = 3, // Đang chuẩn bị hàng
    SHIPPING = 4, // Đang vận chuyển
    DELIVERED = 5, // Đã giao hàng
    CANCELLED = 6, // Đã hủy
    NOT_PAID = 7, // Chưa chuyển khoản
    REQUEST_CANCEL = 8, // Yêu cầu hủy
}

export const OrderStatusText:Record<OrderStatus,string> = {
    [OrderStatus.PENDING]: 'Chờ duyệt',
    [OrderStatus.APPROVED]: 'Đã duyệt',
    [OrderStatus.PREPARING]: 'Đang chuẩn bị hàng',
    [OrderStatus.SHIPPING]: 'Đang vận chuyển',
    [OrderStatus.DELIVERED]: 'Đã giao hàng',
    [OrderStatus.CANCELLED]: 'Đã hủy',
    [OrderStatus.NOT_PAID]: 'Chưa chuyển khoản',
    [OrderStatus.REQUEST_CANCEL]: 'Yêu cầu hủy',
};

export const OrderStatusTextV2:Record<OrderStatus,string> = {
    [OrderStatus.PENDING]: 'Chờ duyệt',
    [OrderStatus.APPROVED]: 'Duyệt',
    [OrderStatus.PREPARING]: 'Chuẩn bị hàng',
    [OrderStatus.SHIPPING]: 'Đang vận chuyển',
    [OrderStatus.DELIVERED]: 'Đã giao hàng',
    [OrderStatus.CANCELLED]: 'Hủy đơn hàng',
    [OrderStatus.NOT_PAID]: 'Chưa chuyển khoản',
    [OrderStatus.REQUEST_CANCEL]: 'Yêu cầu hủy',
};
