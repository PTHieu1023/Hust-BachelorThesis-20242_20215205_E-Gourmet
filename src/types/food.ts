export interface Food {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    tags: string[];
    restaurantId: string;
    rating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface FoodRecommendation {
    foodId: string;
    score: number;
    reasons: string[];
} 