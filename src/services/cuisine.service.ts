"use server"

export interface Cuisine{
    id: number;
    name: string;
    imageUrl: string;
    urlName: string;
    description: string;
}


export const getCuisines = async (): Promise<Cuisine[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        {
            id: 0,
            name: "All",
            imageUrl: "Explore dishes from all cuisines",
            urlName: "all",
            description: "Explore dishes from all cuisines"
        },
        {
            id: 1,
            name: "Italian",
            imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
            description: "Pasta, pizza and more from Italy",
            urlName: "italian"
        },
        {
            id: 2,
            name: "Japanese",
            imageUrl: "https://images.unsplash.com/photo-1564518098550-8f3b4c5d6f0c?w=400",
            description: "Sushi, ramen and traditional dishes",
            "urlName": "japanese"
        },
        {
            id: 3,
            name: "Mexican",
            imageUrl: "https://images.unsplash.com/photo-1603052875000-8f1c6b2d4c5e?w=400",
            description: "Tacos, enchiladas and more",
            urlName: "mexican"
        },
        {
            id: 4,
            name: "Chinese",
            imageUrl: "https://images.unsplash.com/photo-1564518098550-8f3b4c5d6f0c?w=400",
            description: "Dim sum, noodles and regional specialties",
            urlName: "chinese"
        },
        {
            id: 5,
            name: "American",
            imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400",
            description: "Burgers, BBQ and classic American fare",
            urlName: "american"
        },
        {
            id: 6,
            name: "Thai",
            imageUrl: "https://images.unsplash.com/photo-1564518098550-8f3b4c5d6f0c?w=400",
            description: "Curries, noodles and street food",
            urlName: "thai"
        },
        {
            id: 7,
            name: "Indian",
            imageUrl: "https://images.unsplash.com/photo-1564518098550-8f3b4c5d6f0c?w=400",
            description: "Curry, biryani and regional specialties",
            urlName: "indian"
        },
        {
            id: 8,
            name: "French",
            imageUrl: "https://images.unsplash.com/photo-1564518098550-8f3b4c5d6f0c?w=400",
            description: "Pastries, crepes and fine dining",
            urlName: "french"
        }
    ]
}