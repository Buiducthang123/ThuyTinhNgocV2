import type { IOder } from "./order";
import type { IUser } from "./user";

export interface IPayment  {
    id: number;
    amount: number;
    user_id: number;
    order_id: number;
    transaction_type: string;
    user?:IUser;
    order?:IOder;
    created_at: Date;
    updated_at: Date;
}