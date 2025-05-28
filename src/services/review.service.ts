"use server";

import prisma from "@/services/prisma";;
import {getAuthSession} from "@/configs/auth.config";

export async function getDishReviews(dishId: number): Promise<Review[]> {
    return prisma.review.findMany({
        where: { dishId },
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    })
}

export async function createReview(content: string, dishId: number, rating: number, username: string): Promise<Review> {
    const maxId = await prisma.review.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true }
    }).then(review => review.id);
    return prisma.review.create({
        data: {
            id: maxId + 1,
            comment: content,
            rating: rating,
            user: { connect: { username } },
            dish: { connect: { id: dishId } }
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true
                }
            }
        }
    });
}