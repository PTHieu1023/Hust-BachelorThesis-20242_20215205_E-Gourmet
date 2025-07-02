"use server";

import httpClient, {getUrl} from "@/configs/http.config";

export interface Review{
    id: string;
    dish: {
        id: string;
        name: string;
        restaurant: {
            name: string;
            avatar: string;
            username: string;
        }
    };
    rating: number;
    author?: {
        username?: string;
        name?: string;
        avatar?: string;
    };
    review: string;
    createdAt?: Date;
}

export interface ReviewFormProps {
    content: string;
    rating: number;
}

export const getReviews = async (params?: {dishId?: number, page?: number, limit?: number}): Promise<Review[]> => {
    const response = await httpClient.get(getUrl("/api/review"), { params });
    return response.data as Review[];
}

export const getReviewsByDishId = async (dishId: number, page: number = 1, limit: number = 10): Promise<Review[]> => {
    const response = await httpClient.get(getUrl(`/api/review/dish/${dishId}`), { 
        params: { page, limit } 
    });
    return response.data as Review[];
}

export const createReview = async (dishId: number, review: ReviewFormProps) => {
    const response = await httpClient.post(getUrl("/api/review"), {
        dishId: dishId,
        rating: review.rating,
        comment: review.content
    });
    return response.data;
}