"use server"

import httpClient, {getUrl} from "@/configs/http.config";

export interface ShortDishProps {
    id: number,
    name: string,
    urlName?: string,
    description: string,
    price: number,
    restaurantId: number,
    restaurant: string,
    restaurantUsername?: string,
    images?: string[],
    address?: string,
    lat?: number,
    lng?: number,
    cuisineId: number,
    cuisine: string,
    createdAt: Date,
    updatedAt: Date,
    rating: number
}

export interface SearchDishFilterProps {
    search?: string;
    cuisineId?: number;
    restaurantId?: number | string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
}


export async function getDish (params: SearchDishFilterProps): Promise<ShortDishProps[]> {
    const response = await httpClient.get(getUrl("/api/dish"), {params});
    return response.data as ShortDishProps[];
}

export interface DishDetails {
    id: number;
    name: string;
    description: string;
    price: number;
    restaurantId: number;
    restaurant: string;
    restaurantUsername: string;
    restaurantAvatar: string;
    address?: string;
    lat?: number;
    lng?: number;
    cuisineId: number;
    cuisine: string;
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
    rating: number;
    reviewCount: number;
}

export const getDishDetails = async (dishId: number): Promise<DishDetails | null> => {
    try {
        const response = await httpClient.get(getUrl(`/api/dish/${dishId}`));
        return response.data as DishDetails;
    } catch (error) {
        console.error(`Error fetching dish details for ID ${dishId}:`, error);
        return null;
    }
}

export const getDetails = getDishDetails;

export interface Recommendation {
    id: number;
    title: string;
    restaurant: string;
    dish: string;
    urlName: string;
    restaurantUsername: string;
    image?: string;
    rating: number;
    reviewCount: number;
    price: string;
    reason: string;
}

export interface DishListParams {
    page?: number;
    size?: number;
}


export const getRecommendations = async (params?: DishListParams): Promise<Recommendation[]> => {
    const response = await httpClient.get(getUrl("/api/recommendations"), {params});
    return response.data ?? [];
}
