import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {MapPin, Star, Clock, Phone, Globe, Heart} from "lucide-react";

export default async function RestaurantProfilePage({params}: { params: { locale: string, username: string } }) {
    const {username} = await params;

    const restaurant = {
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

    const menuHighlights = [
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

    const recentReviews = [
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

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Cover Image */}
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6">
                <img
                    src={restaurant.coverImage}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute bottom-6 left-6 text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
                    <div className="flex items-center space-x-4">
                        <Badge className="bg-white/90 text-gray-900">
                            {restaurant.category}
                        </Badge>
                        <span className="text-lg font-medium">{restaurant.priceRange}</span>
                    </div>
                </div>
            </div>

            {/* Restaurant Info */}
            <Card className="border-gray-100 mb-6">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${
                                                    i < Math.floor(restaurant.rating)
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-lg font-semibold">{restaurant.rating}</span>
                                    <span className="text-gray-600">({restaurant.reviewCount} reviews)</span>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-6">{restaurant.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-gray-500"/>
                                    <span>{restaurant.address}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-gray-500"/>
                                    <span>{restaurant.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-gray-500"/>
                                    <span>{restaurant.hours}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-4 h-4 text-gray-500"/>
                                    <span>{restaurant.website}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div
                                        className="text-2xl font-bold text-gray-900">{restaurant.followers.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Followers</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{restaurant.posts}</div>
                                    <div className="text-sm text-gray-600">Posts</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                                    <Heart className="w-4 h-4 mr-2"/>
                                    Follow Restaurant
                                </Button>
                                <Button variant="outline" className="w-full">
                                    View Menu
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Make Reservation
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="menu" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
                    <TabsTrigger value="menu">Menu</TabsTrigger>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>
                </TabsList>

                <TabsContent value="menu" className="space-y-6">
                    <Card className="border-gray-100">
                        <CardHeader>
                            <CardTitle>Menu Highlights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {menuHighlights.map((item) => (
                                    <div key={item.id} className="group cursor-pointer">
                                        <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                <span className="font-bold text-orange-600">{item.price}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                                <span className="text-sm font-medium">{item.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="posts" className="space-y-6">
                    <Card className="border-gray-100">
                        <CardContent className="p-12 text-center">
                            <div
                                className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📱</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Restaurant Posts Coming Soon</h3>
                            <p className="text-gray-600">See all posts from this restaurant here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                    <div className="space-y-6">
                        {recentReviews.map((review) => (
                            <Card key={review.id} className="border-gray-100">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={review.avatar} alt={review.author}/>
                                            <AvatarFallback>{review.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-900">{review.author}</h4>
                                                <div className="flex items-center space-x-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${
                                                                i < review.rating
                                                                    ? "text-yellow-400 fill-yellow-400"
                                                                    : "text-gray-300"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-2">{review.review}</p>

                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>Ordered: {review.dish}</span>
                                                <span>{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="photos" className="space-y-6">
                    <Card className="border-gray-100">
                        <CardContent className="p-12 text-center">
                            <div
                                className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📸</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Photo Gallery Coming Soon</h3>
                            <p className="text-gray-600">Browse all photos from this restaurant here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

