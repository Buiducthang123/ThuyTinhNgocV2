import type { IProduct } from "./product";
import type { IUser } from "./user";

export interface IReview {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    user?: IUser;
    product?: IProduct;
    created_at: Date;
}