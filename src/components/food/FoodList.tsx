'use client';

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {useEffect, useState} from "react";
import {fetchCuisines} from "@/services/cuisine.service";
import {Cuisine, Dish} from "@/generated/prisma";
import {getDishes} from "@/services/dish.service";
import {Link} from "@/i18n/navigation";



export default function FoodList() {
    const [cuisine, setCuisine] = useState<number>(0);
    const [cuisineList, setCuisineList] = useState<Cuisine[]>();
    const [foodList, setFoodList] = useState<Dish[]>([]);
    useEffect(() => {
        // Fetch cuisine categories from the server
        const fetchCuisinesData = async () => {
            try {
                const cuisines = await fetchCuisines();
                setCuisineList(cuisines);
                console.log(cuisines);
            } catch (error) {
                console.error("Failed to fetch cuisines:", error);
            }
        };

        fetchCuisinesData().then();
    }, [])

    useEffect(() => {
        const fetchCuisinesData = async () => {
            try {
                const dishes = await getDishes(cuisine);
                setFoodList(dishes);
                console.log(dishes);
            } catch (error) {
                console.error("Failed to fetch dishes:", error);
            }
        };

        fetchCuisinesData().then();
    }, [cuisine]);


    // @ts-ignore
    // @ts-ignore
    return (
        <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                    variant={cuisine === 0 ? "default" : "outline"}
                    onClick={() => setCuisine(0)}
                >
                    All
                </Button>
                {cuisineList?.map((item) => (
                    <Button
                        key={item.name}
                        variant={item.id === cuisine ? "default" : "outline"}
                        onClick={() => setCuisine(item.id)}
                    >
                        {item.name}
                    </Button>
                ))}
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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