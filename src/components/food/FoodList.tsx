'use client';

import { Food } from "@/types/food";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";

interface FoodListProps {
    foods: Food[];
    categories: string[];
    onReview: (foodId: string, rating: number, comment: string) => void;
}

export default function FoodList({ foods, categories, onReview }: FoodListProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const filteredFoods = selectedCategory === "all"
        ? foods
        : foods.filter(food => food.category === selectedCategory);

    return (
        <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("all")}
                >
                    All
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFoods.map((food) => (
                    <Card key={food.id} className="overflow-hidden">
                        <div className="relative h-48">
                            <img
                                src={food.imageUrl}
                                alt={food.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{food.name}</span>
                                <span className="text-lg font-semibold">
                                    ${food.price.toFixed(2)}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {food.description}
                            </p>
                            <div className="flex items-center space-x-2 mb-4">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm">{food.rating.toFixed(1)}</span>
                                <span className="text-sm text-muted-foreground">
                                    ({food.reviewCount} reviews)
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {food.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 