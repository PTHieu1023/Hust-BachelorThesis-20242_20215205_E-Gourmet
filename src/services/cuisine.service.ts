"use server"

import httpClient, {getUrl} from "@/configs/http.config";

export interface Cuisine{
    id: number;
    name: string;
    imageUrl: string;
}


export const getCuisines = async (): Promise<Cuisine[]> => {
    const response =await httpClient.get(getUrl("/api/cuisine"));
    if (!response.data) {
        throw new Error("Failed to fetch cuisines");
    }
    return response.data as Cuisine[];
}