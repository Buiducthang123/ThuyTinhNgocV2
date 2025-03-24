export enum AccountStatus {
    ACTIVE = 1, // Hoạt động
    BLOCKED = 2, // Bị chặn
    NOT_ACTIVE = 3, // Chưa kích hoạt
}

export const AccountStatusText: Record<AccountStatus, string> = {
    [AccountStatus.ACTIVE]: 'Hoạt động',
    [AccountStatus.BLOCKED]: 'Bị chặn',
    [AccountStatus.NOT_ACTIVE]: 'Chưa kích hoạt',
};