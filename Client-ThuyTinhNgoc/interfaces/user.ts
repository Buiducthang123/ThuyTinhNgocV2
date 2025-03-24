import type { IRole } from "./role";
import type { IShippingAddress } from "./shipping_address";

export interface IUser {
    id: number;
    role_id: number;
    full_name: string;
    avatar?: string;
    status: number;
    password: string;
    email: string;
    phone_number?: string;
    company_name?: string;
    company_address?: string;
    company_phone_number?: string;
    company_tax_code?: string;
    contact_person_name?: string;
    representative_id_card?: string;
    representative_id_card_date?: Date;
    contact_person_position?: string;
    shipping_addresses?: IShippingAddress[];
    email_verified_at?: Date;
    role?: IRole;
    created_at: Date;
    updated_at: Date;
}

