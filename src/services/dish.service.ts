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


export async function getDish(params: SearchDishFilterProps): Promise<ShortDishProps[]> {
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

export const getDishDetails = async (dishId: number): Promise<DishDetails> => {
    const response = await httpClient.get(getUrl(`/api/dish/${dishId}`));
    return response.data as DishDetails;
}

export interface Recommendation {
    dishId: number;
    dishName: string;
    restaurantId: number;
    restaurantName: string;
    images?: string[];
    rating: number;
    reviewCount: number;
    price: string;
}

export const getRecommendations = async (userId: string): Promise<Recommendation[]> => {
    const response = await httpClient.get(`${process.env.RECOMMENDATION_API_URL}/${userId}`);
    return response.data as Recommendation[];
}

export interface CreateDishParams {
    restaurantId: number;
    name: string;
    description: string;
    price: number;
    cuisineId: number;
}

export const createDish = async (params: CreateDishParams): Promise<ShortDishProps> => {
    const response = await httpClient.post(getUrl("/api/dish"), params);
    return response.data;
}

export const deleteDish = async (id: number): Promise<string> => {
    const response = await httpClient.delete(getUrl(`/api/dish/${id}`));
    return response.data as string;
}