"use server"

import httpClient, {getUrl} from "@/configs/http.config";
import { AxiosError } from "axios";

export interface Restaurant {
    menu: any;
    posts: any;
    id: number;
    name: string;
    description?: string;
    avatarUrl?: string;
    username: string;
    email?: string;
    phone?: string;
    address?: string;
    lat?: number;
    lng?: number;
    createdAt: Date;
    updatedAt: Date;
    isApproved?: boolean;
}

export interface RestaurantProfile extends Restaurant {
    dishCount: number;
    reviewCount: number;
    averageRating: number;
    postCount: number;
}

export interface RestaurantMenuHighlight {
    id: number;
    name: string;
    description?: string;
    price: number;
    images?: string[];
    rating: number;
    reviewCount: number;
}

export interface RestaurantRecentReview {
    id: number;
    rating: number;
    comment: string;
    createdAt: Date;
    username: string;
    displayName: string;
    avatarUrl?: string;
    dishName: string;
}

export interface RestaurantListParams {
    page?: number;
    limit?: number;
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

export interface RestaurantWithPosts extends Restaurant {
    posts: Array<{
        id: number;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

export const getRestaurants = async (params?: RestaurantListParams): Promise<Restaurant[]> => {
    const response = await httpClient.get(getUrl("/api/restaurant"), { params });
    return response.data as Restaurant[];
}

export const getRestaurantById = async (id: number): Promise<Restaurant> => {
    const response = await httpClient.get(getUrl(`/api/restaurant/${id}`));
    return response.data as Restaurant;
}

export const getRestaurantByUsername = async (username: string): Promise<Restaurant> => {
    const response = await httpClient.get(getUrl(`/api/restaurant/username/${username}`));
    return response.data as Restaurant;
}

export const getRestaurantProfile = async (id: number): Promise<RestaurantProfile> => {
    const response = await httpClient.get(getUrl(`/api/restaurant/${id}/profile`));
    return response.data as RestaurantProfile;
}

export const getRestaurantMenuHighlights = async (id: number): Promise<RestaurantMenuHighlight[]> => {
    const response = await httpClient.get(getUrl(`/api/restaurant/${id}/highlights`));
    return response.data as RestaurantMenuHighlight[];
}

export const getRestaurantRecentReviews = async (id: number): Promise<RestaurantRecentReview[]> => {
    const response = await httpClient.get(getUrl(`/api/restaurant/${id}/reviews`));
    return response.data as RestaurantRecentReview[];
}

export const createRestaurant = async (params: CreateRestaurantParams): Promise<Restaurant> => {
    const response = await httpClient.post(getUrl("/api/restaurant"), params);
    return response.data as Restaurant;
}

export const updateRestaurant = async (id: number, params: Partial<CreateRestaurantParams>): Promise<Restaurant> => {
    const response = await httpClient.put(getUrl(`/api/restaurant/${id}`), params);
    return response.data as Restaurant;
}

export const deleteRestaurant = async (id: number): Promise<void> => {
    await httpClient.delete(getUrl(`/api/restaurant/${id}`));
}

// Placeholder function for following restaurants (not implemented in backend yet)
export const getFollowingRestaurants = async (): Promise<Restaurant[]> => {
    // This functionality requires implementing user following system in backend
    // For now, return empty array to prevent build errors
    return [];
}

export const fetchUserRestaurant = async (): Promise<Restaurant | null> => {
    try {
        const response = await httpClient.get(getUrl("/api/restaurant/user"));
        return response.data as Restaurant;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
            return null; // No restaurant found for the user
        }
        throw error;
    }
};
