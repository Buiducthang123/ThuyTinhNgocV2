import type { IProduct } from "./product";

export interface ICategory {
    id: number;
    name: string;
    avatar?: string;
    description: string;
    slug: string;
    quantity_product: number;
    parent_id: number;
    parent?: ICategory;
    children?:ICategory[];
    products?:IProduct[];
}
