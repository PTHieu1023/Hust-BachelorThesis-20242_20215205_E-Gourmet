import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {MapPin, Star, Heart, MessageCircle, Users} from "lucide-react";

const Profile = () => {
    const userStats = {
        reviews: 89,
        followers: 1247,
        following: 342,
        likes: 2156
    };

    const badges = [
        {name: "Top Reviewer", color: "bg-yellow-100 text-yellow-700"},
        {name: "Italian Expert", color: "bg-green-100 text-green-700"},
        {name: "Local Guide", color: "bg-blue-100 text-blue-700"},
    ];

    const recentReviews = [
        {
            id: "1",
            restaurant: "Bella Nonna",
            dish: "Truffle Carbonara",
            rating: 5,
            review: "Absolutely incredible! The truffle aroma was divine and the pasta was perfectly al dente.",
            date: "2024-01-15",
            likes: 24
        },
        {
            id: "2",
            restaurant: "Sakura Sushi",
            dish: "Omakase Selection",
            rating: 4,
            review: "Fresh fish and creative presentations. The chef's selection was impressive.",
            date: "2024-01-12",
            likes: 18
        }
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Profile Header */}
            <Card className="border-gray-100 mb-6">
                <CardContent className="p-8">
                    <div
                        className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b812b6ab?w=400"
                                         alt="Sarah Chen"/>
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sarah Chen</h1>
                            <p className="text-gray-600 mb-3">Food enthusiast and restaurant explorer based in San
                                Francisco</p>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4"/>
                                    <span>San Francisco, CA</span>
                                </div>
                                <span>•</span>
                                <span>Joined January 2023</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {badges.map((badge) => (
                                    <Badge key={badge.name} className={badge.color}>
                                        {badge.name}
                                    </Badge>
                                ))}
                            </div>

                            <div className="grid grid-cols-4 gap-4 max-w-md">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{userStats.reviews}</div>
                                    <div className="text-sm text-gray-600">Reviews</div>
                                </div>
                                <div className="text-center">
                                    <div
                                        className="text-2xl font-bold text-gray-900">{userStats.followers.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{userStats.following}</div>
                                    <div className="text-sm text-gray-600">Following</div>
                                </div>
                                <div className="text-center">
                                    <div
                                        className="text-2xl font-bold text-gray-900">{userStats.likes.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Likes</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Button className="bg-orange-500 hover:bg-orange-600">
                                Edit Profile
                            </Button>
                            <Button variant="outline">
                                Share Profile
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Content */}
            <Tabs defaultValue="reviews" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews" className="space-y-6">
                    <div className="grid gap-6">
                        {recentReviews.map((review) => (
                            <Card key={review.id} className="border-gray-100">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{review.restaurant}</h3>
                                            <p className="text-sm text-gray-600">{review.dish}</p>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={"key" + i}
                                                    className={`w-4 h-4 ${
                                                        i < review.rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-4">{review.review}</p>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{review.date}</span>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <Heart className="w-4 h-4"/>
                                                <span>{review.likes}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MessageCircle className="w-4 h-4"/>
                                                <span>Reply</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="favorites" className="space-y-6">
                    <Card className="border-gray-100">
                        <CardContent className="p-12 text-center">
                            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Favorites Yet</h3>
                            <p className="text-gray-600">Start hearting posts to build your favorites collection!</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="photos" className="space-y-6">
                    <Card className="border-gray-100">
                        <CardContent className="p-12 text-center">
                            <div
                                className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📸</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Yet</h3>
                            <p className="text-gray-600">Share some delicious food photos to get started!</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="following" className="space-y-6">
                    <Card className="border-gray-100">
                        <CardContent className="p-12 text-center">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Following List</h3>
                            <p className="text-gray-600">Discover and follow amazing food creators and restaurants!</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Profile;
