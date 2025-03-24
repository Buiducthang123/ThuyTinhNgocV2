import type { IDistrict } from "./district";
import type { IProvince } from "./province";
import type { IWard } from "./ward";


export interface IShippingAddress {
    id: number,
    user_id: number,
    receiver_name: string,
    receiver_phone_number: string,
    province: IProvince,
    district: IDistrict,
    ward: IWard,
    specific_address: string,
    is_default: boolean
}