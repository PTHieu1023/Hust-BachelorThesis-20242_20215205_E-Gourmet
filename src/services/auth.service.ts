"use server"

import {Cuisine} from "@/services/cuisine.service";

export const refreshToken = async (refreshToken: string) => {
    const res = await fetch(`${process.env.OAUTH_TOKEN_URL}`, {
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams({
            client_id: `${process.env.OAUTH_CLIENT_ID}`,
            client_secret: `${process.env.OAUTH_CLIENT_SECRET}`,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
        method: "POST",
    })
    if (!res.ok) throw new Error("Failed to refresh token");
    return await res.json();
}

// Clear session in keycloak server via API
export const clearSession = async (idToken: string | undefined) => {
    if (!idToken) return {error: "Invalid token"};
    const url = `${process.env.OAUTH_LOGOUT_URL}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL ?? "http://localhost:3000")}`;
    fetch(url).finally(() => ({message: "Session revoked"}));
}

export interface UserInfo {
    name: string;
    email: string;
    username: string;
    reviews: number;
    followers: number;
    following: number;
    likes: number;
    bio: string;
    address: string;
    avatar: string;
    totalReviews: number;
    avgRating: number;
    favCuisines: Cuisine[];
}

export const getCurrentUserInfo = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        username: "user",
        reviews: 89,
        followers: 1247,
        following: 342,
        likes: 2156,
        bio: "Food enthusiast and restaurant explorer based in San Francisco. Love discovering hidden gems and sharing culinary adventures!",
        address: "San Francisco, CA",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b812b6ab?w=400",
        totalReviews: 20,
        avgRating: 3,
        favCuisines: [{
            id: 1,
            name: "Italian",
            imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
            urlName: "italian",
            description: "ds",
        }, {
            id: 2,
            name: "Japanese",
            imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
            urlName: "japanese",
            description: "ds",
        }]
    }
}
