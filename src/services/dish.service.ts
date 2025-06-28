"use server"

export const getDish = async ( {search, cuisineId, minPrice, maxPrice} : any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
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
            type: "restaurant",
            title: "New Italian spot based on your love for pasta",
            restaurant: "Nonna's Kitchen",
            image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
            rating: 4.6,
            reason: "Similar to Bella Nonna which you rated 5★",
            distance: "0.8 miles away"
        },
        {
            id: 2,
            type: "dish",
            title: "Try this popular ramen everyone's talking about",
            restaurant: "Tokyo Bowl",
            dish: "Tonkotsu Ramen",
            image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
            rating: 4.8,
            reason: "Trending in your area",
            price: "$$"
        },
        {
            id: 3,
            type: "reviewer",
            title: "Follow Sarah - she has similar taste to you",
            reviewer: {
                name: "Sarah Chen",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b812b6ab",
                reviews: 127,
                similarity: "89% taste match"
            },
            reason: "Both love Italian and Japanese cuisine"
        }
    ];
}

export const getTrendingNearYou = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        {
            id: 1,
            name: "Spicy Tuna Bowl",
            restaurant: "Poke Paradise",
            trending: "+25% orders this week",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
        },
        {
            id: 2,
            name: "Truffle Pizza",
            restaurant: "Artisan Slice",
            trending: "+18% orders this week",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b"
        }
    ];
}
