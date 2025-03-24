import type { IProduct } from "./product";

export interface IProductTransaction {
    id: number;
    product_id: number;
    user_id: number;
    type: number;
    status: number;
    quantity: number;
    price: number;
    note: string;
    date: Date;
    product?:IProduct,
    created_at: Date;
    updated_at: Date;
}
