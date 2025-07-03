"use server";

import httpClient, {getUrl} from "@/configs/http.config";

export interface Review {
    id: number;
    comment: string;
    rating: number;
    dishId: number;
    dishName: string;
    dishUrlName?: string;
    dishImage?: string;
    userId: string;
    username: string;
    userDisplayName: string;
    restaurantId: string;
    restaurantName: string;
    restaurantUsername: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface ReviewFormProps {
    content: string;
    rating: number;
}


export const getReviews = async (params?: {
    dishId?: number,
    userId?: string,
    restaurantId?: string,
    page?: number,
    size?: number
}): Promise<Review[]> => {
    const response = await httpClient.get(getUrl("/api/review"), {params});
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