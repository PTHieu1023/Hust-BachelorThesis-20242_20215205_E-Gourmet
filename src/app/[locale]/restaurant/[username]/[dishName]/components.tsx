"use client"

import {useState} from "react";
import {clsx} from "clsx";
import Image from "next/image";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Edit} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import ReviewModal from "@/components/ReviewModal";
import {DishDetails} from "@/services/dish.service";
import {RatingStar} from "@/components/ui/rating-star";
import {Review} from "@/services/review.service";

export const ImageView = ({images}: { images: string[] }) => {
    const [currentImage, setCurrentImage] = useState<number>(0);
    return (
        <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <Image
                    src={images[currentImage]}
                    alt={images[currentImage]}
                    className="w-full h-full object-cover"
                    width={1920}
                    height={1920}
                />
            </div>

            <div className="flex space-x-2">
                {images.map((image, index) => (
                    <button
                        key={"image" + index}
                        onClick={() => setCurrentImage(index)}
                        className={clsx("relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                            {
                                "border-orange-500": currentImage === index,
                                "border-gray-200": currentImage !== index
                            },
                        )}
                    >
                        <Image
                            src={image}
                            alt={image}
                            className="w-full h-full object-cover"
                            width={1920}
                            height={1920}
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}


export const ReviewSection = ({dish, reviews}: { dish: DishDetails, reviews: Review[] }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <Card className="border-gray-100 mb-8">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                    <Button
                        onClick={() => setIsOpen(true)}
                        variant="outline"
                        size="sm"
                        className="hover:bg-orange-50 hover:border-orange-200"
                    >
                        <Edit className="w-4 h-4 mr-2"/>
                        Write Review
                    </Button>
                </div>
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                            <div className="flex items-start space-x-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={review.author?.avatar} alt={review.author?.username}/>
                                    <AvatarFallback>{review.author?.username}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">@{review.author?.username}</h4>
                                        <div className="flex items-center space-x-1">
                                            <RatingStar rating={review.rating}/>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-2">{review.review}</p>
                                    <span className="flex items-center justify-between text-sm text-gray-500">
                                        {review.createdAt.toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <ReviewModal
                    isOpen={isOpen}
                    setIsOpenAction={setIsOpen}
                    dish={dish}
                />
            </CardContent>
        </Card>
    )
}