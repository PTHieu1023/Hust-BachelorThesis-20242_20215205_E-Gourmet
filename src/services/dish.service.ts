"use server"

import httpClient, {getUrl} from "@/configs/http.config";

export interface ShortDishProps {
    id: number,
    name: string,
    description: string,
    price: number,
    restaurantId: number,
    restaurant: string,
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
}

export const getDish = async ( params : SearchDishFilterProps): Promise<ShortDishProps[]> => {
    const response = await httpClient.get(getUrl("/api/dish"), { params });
    return response.data as ShortDishProps[];
}

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

export interface DishDetails {
    id: number | string;
    name: string;
    restaurant: {
        name: string;
        avatar: string;
        username: string;
    };
    price: string;
    rating: number;
    reviewCount: number;
    cuisine: string;
    description: string;
    images: string[];
}

export const getDetails = async () : Promise<DishDetails> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        id: "1",
        name: "Truffle Carbonara",
        restaurant: {
            name: "Bella Nonna Ristorante",
            avatar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
            username: "1"
        },
        price: "$28",
        rating: 4.8,
        reviewCount: 127,
        cuisine: "Italian",
        description: "Our signature truffle carbonara features house-made pasta tossed in a rich cream sauce with Italian black truffles, crispy pancetta, and aged Parmigiano-Reggiano. This indulgent dish represents the perfect marriage of traditional Roman cooking techniques with premium ingredients sourced directly from Italy.",
        images: [
            "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800",
            "https://images.unsplash.com/photo-1573225342350-16731dd9bf3d?w=800",
            "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800"
        ]
    };
}
