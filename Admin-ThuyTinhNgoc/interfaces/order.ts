import type { IOrderItem } from "./orderItem";
import type { IShippingAddress } from "./shipping_address";
import type { IUser } from "./user";

export interface IOder{
    id: number;
    user_id: number;
    user?:IUser;
    shipping_fee: number;
    discount_amount: number;
    status: number;
    final_amount: number;
    payment_method: string|number;
    payment_date: Date | null;
    voucher_code: string;
    shipping_address:IShippingAddress;
    transaction_id: string | null | number;
    ref_id: string | null | number;
    note: string | null;
    order_items?: IOrderItem[];
    created_at?: Date;
    updated_at?: Date;
}