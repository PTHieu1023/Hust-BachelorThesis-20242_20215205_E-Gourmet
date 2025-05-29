"use server"

import {UserRecommendation} from "@/generated/prisma";
import prisma from "@/services/prisma";
import {getAuthSession} from "@/configs/auth.config";

export const getUserRecommendations = async (): Promise<UserRecommendation[]> => {
    try {
        const session = await getAuthSession();
        const username = session?.user?.username;
        if (!username) {
            throw new Error("User not authenticated");
        }
        return await prisma.userRecommendation.findMany({
            where: {
                user:{
                    username: username
                }
            },
            include: {
                dish: true
            },
            orderBy: { score: 'desc' },
        })
    } catch (error) {
        console.error('Error fetching user recommendations:', error);
        throw error;
    }
}