"use server"

export const getFollowingRestaurants = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        {
            id: "2",
            name: "Bella Nonna Ristorante",
            type: "restaurant",
            avatar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
            bio: "Authentic Italian cuisine in the heart of SF",
            location: "North Beach, SF",
            cuisine: "Italian",
            rating: 4.8,
            followers: 5234,
            isFollowing: true,
            lastPost: "3 hours ago"
        },
        {
            id: "4",
            name: "Sakura Sushi Bar",
            type: "restaurant",
            avatar: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
            bio: "Traditional Japanese sushi experience",
            location: "Japantown, SF",
            cuisine: "Japanese",
            rating: 4.9,
            followers: 3891,
            isFollowing: true,
            lastPost: "1 day ago"
        },
        {
            id: "6",
            name: "Green Garden Cafe",
            type: "restaurant",
            avatar: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
            bio: "Plant-based dining with locally sourced ingredients",
            location: "Mission District, SF",
            cuisine: "Vegan",
            rating: 4.7,
            followers: 2156,
            isFollowing: true,
            lastPost: "6 hours ago"
        }
    ];
}