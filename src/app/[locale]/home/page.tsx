import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ForkKnife,
    Star,
    Building2,
    ArrowRight,
    CheckCircle
} from "lucide-react";
import {Link} from "@/i18n/navigation";

const Landing = () => {
    const featuredDishes = [
        {
            name: "Truffle Carbonara",
            restaurant: "Bella Nonna",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
            rating: 4.8,
            price: "$28"
        },
        {
            name: "Dragon Roll",
            restaurant: "Sakura Sushi",
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
            rating: 4.9,
            price: "$24"
        },
        {
            name: "Buddha Bowl",
            restaurant: "Green Garden",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
            rating: 4.7,
            price: "$18"
        }
    ];

    const stats = [
        { number: "10K+", label: "Restaurants" },
        { number: "50K+", label: "Food Lovers" },
        { number: "100K+", label: "Reviews" },
        { number: "25+", label: "Cities" }
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                            Discover Your Next
                            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {" "}Favorite Dish
              </span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Connect with fellow food enthusiasts, discover amazing restaurants, and share your culinary adventures.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <Link href="/" className="flex-1">
                                <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6">
                                    Start Exploring
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>Free to join</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Dishes */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Trending Dishes
                        </h2>
                        <p className="text-gray-600">
                            See what food lovers are talking about
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {featuredDishes.map((dish, index) => (
                            <Card key={index} className="border-gray-100 hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <img
                                        src={dish.image}
                                        alt={dish.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="font-semibold text-gray-900 mb-2">{dish.name}</h3>
                                    <p className="text-gray-600 mb-3">{dish.restaurant}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span className="font-medium">{dish.rating}</span>
                                        </div>
                                        <span className="font-bold text-orange-600">{dish.price}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;