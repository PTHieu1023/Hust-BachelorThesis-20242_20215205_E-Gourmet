"use server"

import {Dish} from "@/generated/prisma";
import prisma from "@/services/prisma";

export async function getDishes(cuisineId: number): Promise<Dish[]> {
    if(cuisineId === 0) {
        return prisma.dish.findMany({
            include:{
                restaurant: true
            }
        });
    }
    return prisma.dish.findMany({
        include:{
            restaurant: true,
            cuisine: true
        },
        where: {cuisineId} });
}

export  async function getDishById(cuisineId: number): Promise<Dish> {
    return prisma.dish.findUnique({
        include: {
            restaurant: true,
            cuisine: true,
            reviews: {
                include: {
                    user: true
                }
            }
        },
        where: {id: cuisineId}
    });
}