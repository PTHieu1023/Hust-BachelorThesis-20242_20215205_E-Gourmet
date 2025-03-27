'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (rating: number, comment: string) => void;
    foodName: string;
}

export default function ReviewDialog({ open, onOpenChange, onSubmit, foodName }: ReviewDialogProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(rating, comment);
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Review {foodName}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`w-6 h-6 ${
                                        star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full p-2 border rounded-md"
                        rows={4}
                    />
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={rating === 0}>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
} 