'use client';

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {useEffect, useState} from "react";
import {fetchCuisines} from "@/services/cuisine.service";
import {Link} from "@/i18n/navigation";
import {Dish} from "@/generated/prisma";



export default function RecommendList() {
    const [foodList, setFoodList] = useState<Dish[]>([]);
    useEffect(() => {
        // Fetch cuisine categories from the server
        const fetchCuisinesData = async () => {
            try {
                const recommend = await fetchCuisines();
                const dishes: Dish[] = recommend.map(item => item.dish);
                setFoodList(dishes);
                console.log(dishes);
            } catch (error) {
                console.error("Failed to fetch cuisines:", error);
            }
        };

        fetchCuisinesData().then();
    }, [])

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {foodList?.map((food) => (
                    <Link key={food.id} href={`/foods/${food.id}`} className="no-underline">`
                        <Card key={food.id} className="overflow-hidden">
                            <div className="relative h-48">
                                <img
                                    src={"/bg.png"}
                                    alt={food.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <CardHeader>
                                {/*@ts-ignore*/}
                                <span>{food?.restaurant.name}</span>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{food.name}</span>
                                    <span className="text-lg font-semibold">
                                        ${food.price.toFixed(2)}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}