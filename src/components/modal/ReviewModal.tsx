"use client";
import {Dispatch, FormEvent, SetStateAction, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Star, Loader2Icon} from "lucide-react";
import {toast} from "sonner";
import {DishDetails} from "@/services/dish.service";
import {createReview, ReviewFormProps} from "@/services/review.service";
import {useRouter} from "@/i18n/navigation";
import {useTranslations} from "next-intl";


interface ReviewModalProps {
    isOpen: boolean;
    setIsOpenAction: Dispatch<SetStateAction<boolean>>;
    dish: DishDetails;
}

const initState: ReviewFormProps = {content: "", rating: 0};

export default function ReviewModal({isOpen, setIsOpenAction, dish}: Readonly<ReviewModalProps>) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [review, setReview] = useState<ReviewFormProps>(initState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const t = useTranslations("restaurant.reviews.modal");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (review.rating < 1 || review.rating > 5) {
            toast.error(t("errors.rating-required"));
            return;
        }

        if (review.content.trim().length < 1) {
            toast.warning(t("errors.content-required"));
            return;
        }

        setIsSubmitting(true);
        createReview(dish.id, review).then(() => {
            toast.success("Review created successfully");
            setIsOpenAction(false)
        }).catch(e => toast.error(e))
            .finally(() => {
                setIsSubmitting(false)
                setReview(initState)
                setIsOpenAction(false);
                router.refresh()
            });
    }

    const handleClose = () => {
        if (!isSubmitting) {
            setReview(initState);
            setIsOpenAction(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">{t("title")}</DialogTitle>
                    <div className="text-sm text-gray-600">
                        <p className="font-medium">{dish.name}</p>
                        <p>{t("at")} {dish.restaurant}</p>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-base font-medium">{t("rating-label")}</Label>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReview({...review, rating: star})}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="p-1 hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-colors ${
                                            star <= (hoveredRating || review.rating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                            {review.rating > 0 && (
                                <span className="ml-3 text-sm text-gray-600">
                                    {review.rating === 1 && t("ratings.poor")}
                                    {review.rating === 2 && t("ratings.fair")}
                                    {review.rating === 3 && t("ratings.good")}
                                    {review.rating === 4 && t("ratings.very-good")}
                                    {review.rating === 5 && t("ratings.excellent")}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="review" className="text-base font-medium">
                            {t("review-label")}
                        </Label>
                        <Textarea
                            id="review"
                            placeholder={t("placeholder")}
                            value={review.content}
                            onChange={(e) => setReview({...review, content: e.target.value})}
                            className="min-h-[120px] resize-none"
                            maxLength={500}
                        />
                        <div className="text-xs text-gray-500 text-right">
                            {review.content.length}/500 {t("characters")}
                        </div>
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
                            {t("buttons.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-orange-500 hover:bg-orange-600"
                            disabled={isSubmitting || review.rating === 0}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2Icon className="w-4 h-4 text-white animate-spin"/>
                                    <span>{t("buttons.submitting")}</span>
                                </div>
                            ) : (
                                t("buttons.submit")
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}