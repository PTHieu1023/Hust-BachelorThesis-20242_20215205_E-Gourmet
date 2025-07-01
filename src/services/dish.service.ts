"use server"

export interface ShortDishProps {
    id: number;
    name: string;
    restaurant: string;
    price: string;
    cuisine: number;
    rating: number;
    image: string;
    description?: string;
}

export interface SearchDishFilterProps {
    search?: string;
    cuisineId?: number;
    minPrice?: number;
    maxPrice?: number;
}

export const getDish = async ( {search, cuisineId, minPrice, maxPrice} : SearchDishFilterProps): Promise<ShortDishProps[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Searching for dishes with params:", {search, cuisineId, minPrice, maxPrice});
    return  [
        {
            id: 1,
            name: "Truffle Carbonara",
            restaurant: "Bella Nonna",
            price: "1000",
            cuisine: 1,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
            description: "Creamy pasta with truffle and pancetta, made with fresh house-made pasta and aged Parmigiano-Reggiano. This signature dish features Italian truffles flown in directly from Umbria."
        },
        {
            id: 2,
            name: "Dragon Roll",
            restaurant: "Sakura Sushi",
            price: "20000",
            cuisine: 2,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
            description: "Fresh sushi roll with eel and avocado, topped with our special dragon sauce and crispy tempura flakes."
        },
        {
            id: 3,
            name: "Buddha Bowl",
            restaurant: "Green Garden",
            price: "10000000",
            cuisine: 3,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
            description: "Quinoa bowl with fresh vegetables, avocado, and tahini dressing. All ingredients are locally sourced and organic."
        }
    ].filter(x =>
        (search == null || search == "" || x.name.toLowerCase().includes(search.toLowerCase())));
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
