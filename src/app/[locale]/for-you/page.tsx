import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Heart, Star, MapPin, TrendingUp, Users, Clock} from "lucide-react";

export default function ForYouPage() {
    const recommendations = [
        {
            id: 1,
            type: "restaurant",
            title: "New Italian spot based on your love for pasta",
            restaurant: "Nonna's Kitchen",
            image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
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
            image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
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
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b812b6ab?w=400",
                reviews: 127,
                similarity: "89% taste match"
            },
            reason: "Both love Italian and Japanese cuisine"
        }
    ];

    const trendingNearYou = [
        {
            id: 1,
            name: "Spicy Tuna Bowl",
            restaurant: "Poke Paradise",
            trending: "+25% orders this week",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
        },
        {
            id: 2,
            name: "Truffle Pizza",
            restaurant: "Artisan Slice",
            trending: "+18% orders this week",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
        }
    ];

    return (

        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Recommendations */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-gray-100">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Heart className="w-5 h-5 text-red-500"/>
                                <span>Personalized For You</span>
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <div className="space-y-4">
                        {recommendations.map(rec => (
                            <Card key={rec.id} className="border-gray-100 hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            {rec.type === "reviewer" ? (
                                                <Avatar className="w-16 h-16">
                                                    <AvatarImage src={rec.reviewer?.avatar}
                                                                 alt={rec.reviewer?.name}/>
                                                    <AvatarFallback>SC</AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <img
                                                    src={rec.image}
                                                    alt={rec.title}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>

                                            {rec.type === "restaurant" && (
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                                        <span className="text-sm">{rec.rating}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="w-4 h-4 text-gray-400"/>
                                                        <span
                                                            className="text-sm text-gray-600">{rec.distance}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {rec.type === "dish" && (
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <span className="text-sm font-medium">{rec.restaurant}</span>
                                                    <Badge variant="outline">{rec.price}</Badge>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                                        <span className="text-sm">{rec.rating}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {rec.type === "reviewer" && (
                                                <div className="flex items-center space-x-4 mb-3">
                                                        <span
                                                            className="text-sm text-gray-600">{rec.reviewer?.reviews} reviews</span>
                                                    <Badge className="bg-green-100 text-green-700">
                                                        {rec.reviewer?.similarity}
                                                    </Badge>
                                                </div>
                                            )}

                                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                                {rec.type === "reviewer" ? "Follow" : "Explore"}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Trending Near You */}
                    <Card className="border-gray-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2 text-lg">
                                <TrendingUp className="w-5 h-5 text-orange-500"/>
                                <span>Trending Near You</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {trendingNearYou.map(item => (
                                <div key={item.id} className="flex items-center space-x-3 group cursor-pointer">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">{item.restaurant}</p>
                                        <p className="text-xs text-green-600 font-medium">{item.trending}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="border-gray-100 bg-gradient-to-br from-orange-50 to-red-50">
                        <CardContent className="p-6 text-center space-y-4">
                            <div
                                className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                                <Users className="w-6 h-6 text-white"/>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Your Taste Profile</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Favorite Cuisine:</span>
                                        <span className="font-medium">Italian</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Average Rating:</span>
                                        <span className="font-medium">4.2★</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Reviews Written:</span>
                                        <span className="font-medium">89</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
