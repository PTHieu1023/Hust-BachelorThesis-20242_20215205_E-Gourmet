"use server"

export const getDish = async ( {search, cuisineId, minPrice, maxPrice} : any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return  [
        {
            id: 1,
            name: "Truffle Carbonara",
            restaurant: "Bella Nonna",
            price: "1000",
            cuisine: 1,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
            description: "Creamy pasta with truffle and pancetta, made with fresh house-made pasta and aged Parmigiano-Reggiano. This signature dish features Italian truffles flown in directly from Umbria."
        },
        {
            id: 2,
            name: "Dragon Roll",
            restaurant: "Sakura Sushi",
            price: "20000",
            cuisine: 2,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
            description: "Fresh sushi roll with eel and avocado, topped with our special dragon sauce and crispy tempura flakes."
        },
        {
            id: 3,
            name: "Buddha Bowl",
            restaurant: "Green Garden",
            price: "10000000",
            cuisine: 3,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
            description: "Quinoa bowl with fresh vegetables, avocado, and tahini dressing. All ingredients are locally sourced and organic."
        }
    ].filter(x =>
        (search == null || search == "" || x.name.toLowerCase().includes(search.toLowerCase())));
}