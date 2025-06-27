"use client";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Search, Filter, MapPin, Star} from "lucide-react";
import {Link} from "@/i18n/navigation";
import Image from "next/image";

export default function DiscoveryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCuisine, setSelectedCuisine] = useState("all");
    const [selectedPrice, setSelectedPrice] = useState("all");

    const cuisines = ["Italian", "Japanese", "Mexican", "Chinese", "American", "Thai", "Indian", "French"];
    const priceRanges = ["$", "$$", "$$$", "$$$$"];

    const dishes = [
        {
            id: 1,
            name: "Truffle Carbonara",
            restaurant: "Bella Nonna",
            price: "$$$",
            cuisine: "Italian",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
            description: "Creamy pasta with truffle and pancetta, made with fresh house-made pasta and aged Parmigiano-Reggiano. This signature dish features Italian truffles flown in directly from Umbria."
        },
        {
            id: 2,
            name: "Dragon Roll",
            restaurant: "Sakura Sushi",
            price: "$$",
            cuisine: "Japanese",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
            description: "Fresh sushi roll with eel and avocado, topped with our special dragon sauce and crispy tempura flakes."
        },
        {
            id: 3,
            name: "Buddha Bowl",
            restaurant: "Green Garden",
            price: "$$",
            cuisine: "Vegan",
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
            description: "Quinoa bowl with fresh vegetables, avocado, and tahini dressing. All ingredients are locally sourced and organic."
        }
    ];

    const filteredDishes = dishes.filter(dish => {
        const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dish.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCuisine = selectedCuisine === "all" || dish.cuisine === selectedCuisine;
        const matchesPrice = selectedPrice === "all" || dish.price === selectedPrice;

        return matchesSearch && matchesCuisine && matchesPrice;
    });

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Search and Filters */}
            <Card className="border-gray-100 mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Search className="w-5 h-5 text-orange-500"/>
                        <span>Discover Dishes</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search dishes or restaurants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Cuisine"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Cuisines</SelectItem>
                                {cuisines.map(cuisine => (
                                    <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Price Range"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Prices</SelectItem>
                                {priceRanges.map(price => (
                                    <SelectItem key={price} value={price}>{price}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="outline" className="flex items-center space-x-2">
                            <Filter className="w-4 h-4"/>
                            <span>More Filters</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDishes.map(dish => (
                    <Link key={dish.id} href={`/restaurant/1/${dish.id}`}>
                        <Card className="border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="relative">
                                <Image
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                    width={32} height={32}
                                />
                                <Badge className="absolute top-2 right-2 bg-white text-gray-800">
                                    {dish.price}
                                </Badge>
                            </div>

                            <CardContent className="p-4">
                                <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dish.description}</p>

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-4 h-4 text-gray-400"/>
                                        <span className="text-sm text-gray-600">{dish.restaurant}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                        <span className="text-sm font-medium">{dish.rating}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Badge variant="outline">{dish.cuisine}</Badge>
                                    <Button
                                        size="sm"
                                        className="bg-orange-500 hover:bg-orange-600"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};