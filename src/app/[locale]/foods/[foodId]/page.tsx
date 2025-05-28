"use client";
import {FormEvent, useEffect, useState} from "react";
import {Dish} from "@/generated/prisma";
import {useParams} from "next/navigation";
import {getDishById} from "@/services/dish.service";
import {createReview} from "@/services/review.service";
import useAuth from "@/hooks/useAuth";

;

export default function DetailFoodPage() {
    const [showModal, setShowModal] = useState(false);
    const params = useParams();
    const [dish, setDish] = useState<Dish>()
    const [reviewContent, setReviewContent] = useState<string>("");
    const [reviewRating, setReviewRating] = useState<number>(5);
    const { user } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            const dishId = parseInt(params.foodId);
            const response = await getDishById(dishId);
            setDish(response);
        }
        fetchData().then();
    }, [showModal]);

    const handleAddReview = (e: FormEvent) => {
        e.preventDefault();
        createReview(reviewContent, dish?.id, reviewRating, user.username).then(review => {
            setReviewContent("")
            setReviewRating(5)
            setShowModal(false);
        })
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3 flex-shrink-0">
                    <img
                        src={"/bg.png"}
                        alt={dish?.name}
                        className="w-full h-64 object-cover rounded-lg shadow"
                    />
                </div>
                {/* Dish Details */}
                <div className="md:w-2/3 flex flex-col justify-center">
                    <span>{dish?.restaurant.name}</span>
                    <h1 className="text-3xl font-bold mb-2">{dish?.name}</h1>
                    <div className="mb-2 text-gray-600">
                        {dish?.cuisine.name} - {dish?.price.toLocaleString('vi-VN', {})} VND
                    </div>
                    <p className="mb-2 text-gray-700">Some description</p>
                </div>
            </div>
            {/* Reviews */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                {dish?.reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews.</p>
                ) : (
                    <ul className="space-y-4">
                        {dish?.reviews.map((review) => (
                            <li key={review.id} className="border-b pb-3">
                                <div className="flex justify-between items-center gap-2 mb-1">
                                    <span className="font-medium">{review.user.name}</span>
                                    <span>{review.rating}</span>
                                </div>
                                <div>{review.comment}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* Add Review Button */}
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowModal(true)}
            >
                Add Review
            </button>
            {/* Review Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-0">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Review food</h2>
                        <form onSubmit={handleAddReview}>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">Review</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    rows={4}
                                    required
                                    value={reviewContent}
                                    onChange={e => setReviewContent(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">Rating</label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    required
                                    value={reviewRating}
                                    onChange={e => setReviewRating(parseInt(e.target.value))}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
