"use server"

import httpClient, {getUrl} from "@/configs/http.config";

export interface Restaurant {
    id: number;
    name: string;
    description?: string;
    avatarUrl?: string;
    username: string;
    email?: string;
    phone?: string;
    address?: string;
    openHour?: string;
    lat?: number;
    lng?: number;
    website?: string;
    coverImage?: string;
    createdAt: Date;
    updatedAt: Date;
    isApproved?: boolean;
    dishCount: number;
    reviewCount: number;
    averageRating: number;
    postCount: number;
    followerCount: number;
}

export interface GetRestaurantParams {
    followBy?: string;
    managedBy?: string;
    restaurantId?: number | string;
    page?: number;
    size?: number;
}

export interface CreateRestaurantParams {
    name: string;
    description?: string;
    avatarUrl?: string;
    username: string;
    email?: string;
    phone?: string;
    address?: string;
    lat?: number;
    lng?: number;
}

export const createRestaurant = async (params: CreateRestaurantParams): Promise<Restaurant> => {
    const response = await httpClient.post(getUrl("/api/restaurant"), params);
    if (!response.data?.data) {
        throw new Error("Failed to create restaurant");
    }
    return response.data.data as Restaurant;
}

export const updateRestaurant = async (id: number, params: Partial<CreateRestaurantParams>): Promise<Restaurant> => {
    const response = await httpClient.put(getUrl(`/api/restaurant/${id}`), params);
    if (!response.data?.data) {
        throw new Error("Failed to update restaurant");
    }
    return response.data.data as Restaurant;
}

export const deleteRestaurant = async (id: number): Promise<void> => {
    await httpClient.delete(getUrl(`/api/restaurant/${id}`));
}

export const getRestaurants = async (params: GetRestaurantParams): Promise<Restaurant[]> => {
    const response = await httpClient.get(getUrl(`/api/restaurant`), {params});
    return response.data as Restaurant[];
}