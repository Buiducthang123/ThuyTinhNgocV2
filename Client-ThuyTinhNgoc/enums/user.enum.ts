export enum EUser {
    ACTIVE = 1, // Hoạt động
    BLOCKED = 2, // Bị chặn
    NOT_ACTIVATED = 3, // Chưa kích hoạt
}

export const EUserText: Record<EUser,string> = {
    [EUser.ACTIVE]: 'Hoạt động',
    [EUser.BLOCKED]: 'Bị chặn',
    [EUser.NOT_ACTIVATED]: 'Chưa kích hoạt',
}
     