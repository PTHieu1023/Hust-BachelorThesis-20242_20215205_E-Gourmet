"use server";

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
    createdAt: Date;
}

export const getReviews = async (): Promise<Review[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        {
            id: "1",
            dish: {
                id: '1',
                name: "Truffle Carbonara",
                restaurant: {
                    name: "Bella Nonna Ristorante",
                    avatar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
                    username: "bella_nonna"
                }
            },
            rating: 5,
            author:{
                username: "sarah_chen",
                name: "Sarah Chen",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b812b6ab?w=400"
            },
            review: "Absolutely incredible! The truffle aroma was divine and the pasta was perfectly al dente.",
            createdAt: new Date(),
        },
        {
            id: "2",
            author: {
                name: "Sakura Sushi",
                avatar: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
                username: "sakura_sushi"
            },
            dish: {
                id: '2',
                name: "Sushi Deluxe",
                restaurant: {
                    name: "Sakura Sushi",
                    avatar: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
                    username: "sakura_sushi"
                }
            },
            rating: 4,
            review: "Fresh fish and creative presentations. The chef's selection was impressive.",
            createdAt: new Date(),
        }
    ];
}

export interface ReviewFormProps {
    content: string;
    rating: number;
}

export const createReview = async (dishId: number, review: ReviewFormProps )=> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        ...review,
        dishId: dishId,
        id: Math.random().toString(36).substring(2, 15),
        createdAt: new Date(),
    };
}