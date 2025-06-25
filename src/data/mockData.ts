export interface Post {
    id: string;
    type: "restaurant";
    author: {
        name: string;
        avatar: string;
        isRestaurant: true; // Always true since only restaurant can post
        restaurantId: string;
    };
    content: {
        title: string;
        description: string;
        images: string[];
        price?: string; // For menu items
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

export const mockPosts: Post[] = [
    {
        id: "1",
        type: "restaurant",
        author: {
            name: "Bella Nonna Ristorante",
            avatar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
            isRestaurant: true,
            restaurantId: "1"
        },
        content: {
            title: "Fresh Truffle Season Has Arrived! 🍄",
            description: "We're excited to announce our limited-time truffle menu featuring fresh Italian truffles flown in directly from Umbria. Our signature truffle carbonara is made with house-made pasta and aged Parmigiano-Reggiano. Book your table now for an unforgettable culinary experience!",
            images: [
                "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800",
                "https://images.unsplash.com/photo-1573225342350-16731dd9bf3d?w=800"
            ],
            category: "menu",
            price: "$28"
        },
        engagement: {
            likes: 147,
            comments: 23,
            shares: 8
        },
        timestamp: "2 hours ago",
        cuisine: "italian",
        location: "San Francisco, CA"
    },
    {
        id: "2",
        type: "restaurant",
        author: {
            name: "Green Garden Cafe",
            avatar: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
            isRestaurant: true,
            restaurantId: "2"
        },
        content: {
            title: "New Weekend Brunch Menu Launch! 🥞",
            description: "Introducing our plant-based brunch menu every Saturday and Sunday! Featuring our signature avocado toast with heirloom tomatoes, fluffy vegan pancakes with seasonal berries, and our famous Buddha bowl with quinoa and roasted vegetables. All ingredients sourced locally from organic farms.",
            images: [
                "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800",
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
                "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800"
            ],
            category: "announcement"
        },
        engagement: {
            likes: 203,
            comments: 34,
            shares: 15
        },
        timestamp: "6 hours ago",
        cuisine: "vegan",
        location: "Mission District"
    },
    {
        id: "3",
        type: "restaurant",
        author: {
            name: "Sakura Sushi Bar",
            avatar: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
            isRestaurant: true,
            restaurantId: "3"
        },
        content: {
            title: "Chef's Special: Omakase Experience",
            description: "Join us for an exclusive 8-course omakase experience featuring the finest seasonal ingredients. Our head chef will prepare each course fresh at the sushi bar. Limited seating available - reservations required.",
            images: [
                "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
                "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800"
            ],
            category: "special",
            price: "$85"
        },
        engagement: {
            likes: 89,
            comments: 12,
            shares: 5
        },
        timestamp: "1 day ago",
        cuisine: "japanese",
        location: "Downtown SF"
    },
    {
        id: "4",
        type: "restaurant",
        author: {
            name: "Spice Route",
            avatar: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
            isRestaurant: true,
            restaurantId: "4"
        },
        content: {
            title: "Live Music Night Every Friday! 🎵",
            description: "Join us every Friday evening for live acoustic performances while enjoying our authentic Thai cuisine. Tonight featuring local artist Maya Chen performing from 7-9 PM. No cover charge - just great food and music!",
            images: [
                "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=800"
            ],
            category: "event"
        },
        engagement: {
            likes: 124,
            comments: 19,
            shares: 7
        },
        timestamp: "1 day ago",
        cuisine: "thai",
        location: "Chinatown"
    }
];