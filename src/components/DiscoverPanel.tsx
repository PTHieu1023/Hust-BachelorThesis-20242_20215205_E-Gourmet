import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const DiscoveryPanel = () => {
    const trendingRestaurants = [
        {
            id: "1",
            name: "Bella Nonna",
            category: "Italian",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
            trending: "+12% this week"
        },
        {
            id: "2",
            name: "Sakura Sushi",
            category: "Japanese",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
            trending: "+8% this week"
        },
        {
            id: "3",
            name: "Green Garden",
            category: "Vegan",
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
            trending: "+15% this week"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Trending Restaurants */}
            <Card className="border-gray-100">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                        <Star className="w-5 h-5 text-orange-500" />
                        <span>For you</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {trendingRestaurants.map((restaurant) => (
                        <div key={restaurant.id} className="flex items-center space-x-3 group cursor-pointer">
                            <div className="relative">
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                                    {restaurant.name}
                                </h4>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-xs">
                                        {restaurant.category}
                                    </Badge>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs text-gray-600">{restaurant.rating}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-green-600 font-medium">{restaurant.trending}</p>
                            </div>
                        </div>
                    ))}
                    <a href="/for-you">
                        <Button variant="outline" className="w-full mt-4 hover:bg-orange-50 hover:border-orange-200">
                            View more
                        </Button>
                    </a>
                </CardContent>
            </Card>
        </div>
    );
};

export default DiscoveryPanel;