import type { IProduct } from "./product";

export interface IShoppingCardItem extends IProduct {
    pivot?: {
        quantity?: number;
    },
    isApplyingDiscount?: boolean;

}