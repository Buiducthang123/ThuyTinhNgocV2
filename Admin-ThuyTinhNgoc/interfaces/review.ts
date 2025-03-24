import type { IProduct } from "./product";
import type { IUser } from "./user";

export interface IReview {
    id: number;
    user_id: number;
    order_id: number;
    product_id: number;
    rating: number;
    product?:IProduct;
    user?:IUser;
    comment: string;
    created_at: Date;
}