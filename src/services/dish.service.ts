"use server"

import httpClient, {getUrl} from "@/configs/http.config";

export interface ShortDishProps {
    id: number,
    name: string,
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
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}

export const getDish = async (params: SearchDishFilterProps): Promise<ShortDishProps[]> => {
    const response = await httpClient.get(getUrl("/api/dish"), { params });
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

// Legacy function name for backward compatibility
export const getDetails = getDishDetails;

export const getRecommendations = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return  [
        {
            id: 1,
            title: "Try this popular ramen everyone's talking about",
            restaurant: "Tokyo Bowl",
            dish: "Tonkotsu Ramen",
            image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
            rating: 4.8,
            reason: "Trending in your area",
            price: "$$"
        }
    ];
}
