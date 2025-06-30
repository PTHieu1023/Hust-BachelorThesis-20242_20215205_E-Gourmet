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
};

export const getRestaurantProfile = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
        id: "1",
        name: "Bella Nonna Ristorante",
        category: "Italian",
        rating: 4.8,
        reviewCount: 247,
        priceRange: "$$",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
        coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
        description: "Authentic Italian cuisine in the heart of the city. Family recipes passed down through generations.",
        address: "123 Main Street, San Francisco, CA",
        phone: "(555) 123-4567",
        website: "www.bellanonna.com",
        hours: "Mon-Sun: 5:00 PM - 10:00 PM",
        followers: 2847,
        posts: 156
    };
};

export const getRestaurantMenuHighlights = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
        {
            id: "1",
            name: "Truffle Carbonara",
            price: "$28",
            description: "House-made pasta with truffle cream sauce and pancetta",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
            rating: 4.9
        },
        {
            id: "2",
            name: "Margherita Pizza",
            price: "$22",
            description: "San Marzano tomatoes, fresh mozzarella, basil",
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
            rating: 4.7
        },
        {
            id: "3",
            name: "Tiramisu",
            price: "$12",
            description: "Classic Italian dessert with espresso and mascarpone",
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
            rating: 4.8
        }
    ];
};

export const getRestaurantRecentReviews = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
        {
            id: "1",
            author: "Sarah Chen",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b812b6ab?w=400",
            rating: 5,
            review: "Outstanding service and the carbonara was perfection! The atmosphere is cozy and romantic.",
            date: "2024-01-15",
            dish: "Truffle Carbonara"
        },
        {
            id: "2",
            author: "Marco Rodriguez",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
            rating: 4,
            review: "Great authentic Italian food. The pizza dough was perfectly crispy and the ingredients were fresh.",
            date: "2024-01-12",
            dish: "Margherita Pizza"
        }
    ];
};

export interface Stat {
    label: string;
    value: string;
    change: string;
    icon: string;
    color: string;
}

export interface RecentPost {
    id: string;
    title: string;
    engagement: {
        likes: number;
        comments: number;
        shares: number;
    };
    status: string;
    date: string;
}

export async function fetchStats(): Promise<Stat[]> {
    return [
        { label: "Total Followers", value: "2,847", change: "+12%", icon: "Users", color: "text-blue-600" },
        { label: "Posts This Month", value: "24", change: "+8%", icon: "TrendingUp", color: "text-green-600" },
        { label: "Average Rating", value: "4.8", change: "+0.2", icon: "Star", color: "text-yellow-600" },
        { label: "Total Reviews", value: "156", change: "+18%", icon: "MessageCircle", color: "text-purple-600" },
    ];
}

export async function fetchRecentPosts(): Promise<RecentPost[]> {
    return [
        {
            id: "1",
            title: "Fresh Truffle Pasta Special",
            engagement: { likes: 89, comments: 12, shares: 5 },
            status: "published",
            date: "2024-01-15"
        },
        {
            id: "2",
            title: "Weekend Brunch Menu Launch",
            engagement: { likes: 156, comments: 28, shares: 15 },
            status: "published",
            date: "2024-01-14"
        },
        {
            id: "3",
            title: "Chef's Special: Seafood Risotto",
            engagement: { likes: 234, comments: 45, shares: 22 },
            status: "published",
            date: "2024-01-13"
        }
    ];
}

