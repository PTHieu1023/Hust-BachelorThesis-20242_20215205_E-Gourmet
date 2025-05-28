"use server"

import prisma from "@/services/prisma";

export const fetchCuisines = async() => {
    return prisma.cuisine.findMany();
};