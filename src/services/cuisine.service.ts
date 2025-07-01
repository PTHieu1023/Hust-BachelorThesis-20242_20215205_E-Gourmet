"use server"

import httpClient from "@/configs/http.config";

export interface Cuisine{
    id: number;
    name: string;
    imageUrl: string;
}


export const getCuisines = async (): Promise<Cuisine[]> => {
    const response =await httpClient.get("/api/v1/cuisine");
    if (!response.data) {
        throw new Error("Failed to fetch cuisines");
    }
    return response.data as Cuisine[];
}