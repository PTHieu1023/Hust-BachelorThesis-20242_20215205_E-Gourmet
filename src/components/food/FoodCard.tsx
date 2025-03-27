'use client';

import { Food } from "@/types/food";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ReviewDialog from "@/components/food/ReviewDialog";

interface FoodCardProps {
    food: Food;
    onReview?: (rating: number, comment: string) => void;
}

export default function FoodCard({ food, onReview }: FoodCardProps) {
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
                <Image
                    src={food.imageUrl}
                    alt={food.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{food.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                    {food.description}
                </p>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{food.rating.toFixed(1)}</span>
                        <span className="ml-1 text-sm text-gray-500">
                            ({food.reviewCount} reviews)
                        </span>
                    </div>
                    <span className="text-lg font-semibold">
                        ${food.price.toFixed(2)}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {food.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsReviewOpen(true)}
                >
                    Write a Review
                </Button>
            </div>
            <ReviewDialog
                open={isReviewOpen}
                onOpenChange={setIsReviewOpen}
                onSubmit={onReview ?? (() => {})}
                foodName={food.name}
            />
        </div>
    );
} 