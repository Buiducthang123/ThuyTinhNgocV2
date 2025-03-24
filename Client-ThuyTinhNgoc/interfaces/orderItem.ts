import type { IProduct } from "./product";

export interface IOrderItem{
    id: number;
    order_id: number;
    product_id: number;
    product?:IProduct;
    quantity: number;
    price: number;
    discount: number;
    created_at?: Date;
    updated_at?: Date;
}
