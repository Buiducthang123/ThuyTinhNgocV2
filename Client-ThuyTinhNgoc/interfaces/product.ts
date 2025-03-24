import type { ICategory } from "./category";


export interface IDiscountTier {
    id: number;
    product_id: number;
    minimum_quantity: number;
    price: number;
}
export interface IProduct {
    id: number;
    category_id: number;
    promotion_id: number | null;
    title: string;
    slug: string;
    cover_image: string;
    thumbnail: string[];
    short_description?: string;
    description: string;
    is_sale: number;
    price: number;
    discount: number;
    pages: number;
    weight: number;
    height: number;
    dimension_length: number;
    dimension_width: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    quantity?: number;
    category?: ICategory;
    rating: number;
    total_review: number;
    discount_tiers?: IDiscountTier[];
}