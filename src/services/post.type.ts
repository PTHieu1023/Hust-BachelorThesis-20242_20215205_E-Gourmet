export interface Post {
    id: string;
    type: "restaurant";
    author: {
        name: string;
        avatar: string;
        isRestaurant: true;
        restaurantId: string;
    };
    content: {
        title: string;
        description: string;
        images: string[];
        price?: string;
        category: "menu" | "special" | "event" | "announcement";
    };
    engagement: {
        likes: number;
        comments: number;
        shares: number;
    };
    timestamp: string;
    cuisine: string;
    location?: string;
} 