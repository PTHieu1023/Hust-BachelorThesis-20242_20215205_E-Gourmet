'use client';

import { useState } from "react";
import FoodList from "@/components/food/FoodList";
import { Food, FoodRecommendation } from "@/types/food";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

// Dữ liệu mẫu
const sampleFoods: Food[] = [
    {
        id: "1",
        name: "Phở Bò",
        description: "Traditional Vietnamese noodle soup with beef",
        price: 12.99,
        imageUrl: "/images/pho.jpg",
        category: "Vietnamese",
        tags: ["soup", "noodles", "beef"],
        restaurantId: "1",
        rating: 4.5,
        reviewCount: 128,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        name: "Sushi Roll",
        description: "Fresh salmon and avocado roll with premium rice",
        price: 15.99,
        imageUrl: "/images/sushi.jpg",
        category: "Japanese",
        tags: ["sushi", "seafood", "raw"],
        restaurantId: "2",
        rating: 4.8,
        reviewCount: 256,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "3",
        name: "Dim Sum",
        description: "Steamed dumplings with various fillings",
        price: 9.99,
        imageUrl: "/images/dimsum.jpg",
        category: "Chinese",
        tags: ["dumplings", "steamed", "appetizer"],
        restaurantId: "3",
        rating: 4.3,
        reviewCount: 89,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const sampleCategories = ["Vietnamese", "Chinese", "Japanese", "Korean", "Thai"];

const sampleRecommendations: FoodRecommendation[] = [
    {
        foodId: "1",
        score: 0.95,
        reasons: ["Based on your favorite Vietnamese dishes", "High-rated by users with similar preferences"],
    },
    {
        foodId: "2",
        score: 0.88,
        reasons: ["Popular in your area", "Matches your price range"],
    },
];

export default function Home() {
    const [activeTab, setActiveTab] = useState("all");

    const handleReview = (foodId: string, rating: number, comment: string) => {
        // TODO: Implement review submission
        console.log("Review submitted:", { foodId, rating, comment });
    };

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="relative h-[400px] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                <img
                    src="/images/hero.jpg"
                    alt="Food background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-white">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold">
                            Discover Amazing Food
                        </h1>
                        <p className="text-xl md:text-2xl">
                            Share your experiences and get personalized recommendations
                        </p>
                        <Button size="lg" className="mt-4">
                            Start Exploring
                        </Button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="all">All Foods</TabsTrigger>
                    <TabsTrigger value="recommended">Recommended</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <FoodList
                        foods={sampleFoods}
                        categories={sampleCategories}
                        onReview={handleReview}
                    />
                </TabsContent>

                <TabsContent value="recommended">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sampleRecommendations.map((rec) => {
                            const food = sampleFoods.find((f) => f.id === rec.foodId);
                            if (!food) return null;

                            return (
                                <Card key={rec.foodId}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>Recommended for you</span>
                                            <span className="text-sm text-muted-foreground">
                                                {Math.round(rec.score * 100)}% match
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm">{food.rating.toFixed(1)}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    ({food.reviewCount} reviews)
                                                </span>
                                            </div>
                                            <ul className="space-y-2">
                                                {rec.reasons.map((reason, index) => (
                                                    <li key={index} className="text-sm text-muted-foreground">
                                                        • {reason}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
