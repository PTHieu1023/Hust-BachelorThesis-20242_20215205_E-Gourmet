import {FormEvent, useState} from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Camera, X } from "lucide-react";
import {toast} from "sonner";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    dishName: string;
    restaurantName: string;
}

const ReviewModal = ({ isOpen, onClose, dishName, restaurantName }: ReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Please select a rating before submitting your review.");
            return;
        }

        if (reviewText.trim().length < 10) {
            toast.warning("Your review must be at least 10 characters long.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log("Review submitted:", {
                dishName,
                restaurantName,
                rating,
                reviewText,
                images: uploadedImages
            });

            toast.info("Review submitted successfully!");

            // Reset form
            setRating(0);
            setReviewText("");
            setUploadedImages([]);
            onClose();
        } catch (error) {
            toast.error("Failed to submit review. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = () => {
        // Simulate image upload - in a real app this would handle file selection
        const mockImageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400`;
        setUploadedImages(prev => [...prev, mockImageUrl]);
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setRating(0);
            setReviewText("");
            setUploadedImages([]);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Write a Review</DialogTitle>
                    <div className="text-sm text-gray-600">
                        <p className="font-medium">{dishName}</p>
                        <p>at {restaurantName}</p>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating Section */}
                    <div className="space-y-2">
                        <Label className="text-base font-medium">Your Rating *</Label>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="p-1 hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-colors ${
                                            star <= (hoveredRating || rating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-3 text-sm text-gray-600">
                  {rating === 1 && "Poor"}
                                    {rating === 2 && "Fair"}
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Very Good"}
                                    {rating === 5 && "Excellent"}
                </span>
                            )}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2">
                        <Label htmlFor="review" className="text-base font-medium">
                            Your Review *
                        </Label>
                        <Textarea
                            id="review"
                            placeholder="Share your experience with this dish. What did you like or dislike about it?"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="min-h-[120px] resize-none"
                            maxLength={500}
                        />
                        <div className="text-xs text-gray-500 text-right">
                            {reviewText.length}/500 characters
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium">Add Photos (Optional)</Label>

                        {uploadedImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {uploadedImages.map((image, index) => (
                                    <div key={"image" + index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`Review photo ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {uploadedImages.length < 3 && (
                            <button
                                type="button"
                                onClick={handleImageUpload}
                                className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-orange-300 transition-colors"
                            >
                                <Camera className="w-6 h-6 text-gray-400 mb-1" />
                                <span className="text-sm text-gray-600">Add Photo</span>
                            </button>
                        )}
                    </div>

                    {/* Tips */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-orange-800 mb-2">Tips for a great review:</h4>
                        <ul className="text-xs text-orange-700 space-y-1">
                            <li>• Describe the taste, texture, and presentation</li>
                            <li>• Mention if it met your expectations</li>
                            <li>• Include details about portion size and value</li>
                            <li>• Be honest and constructive</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-orange-500 hover:bg-orange-600"
                            disabled={isSubmitting || rating === 0}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Submitting...</span>
                                </div>
                            ) : (
                                "Submit Review"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewModal;