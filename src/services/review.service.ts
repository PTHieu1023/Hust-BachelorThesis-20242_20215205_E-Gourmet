"use server";

export const getCurrentReview = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        {
            id: "1",
            restaurant: "Bella Nonna",
            dish: "Truffle Carbonara",
            rating: 5,
            review: "Absolutely incredible! The truffle aroma was divine and the pasta was perfectly al dente.",
            date: "2024-01-15",
            likes: 24
        },
        {
            id: "2",
            restaurant: "Sakura Sushi",
            dish: "Omakase Selection",
            rating: 4,
            review: "Fresh fish and creative presentations. The chef's selection was impressive.",
            date: "2024-01-12",
            likes: 18
        }
    ];
}