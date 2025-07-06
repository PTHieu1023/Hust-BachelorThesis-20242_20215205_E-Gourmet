"use server"

import httpClient, {getUrl} from "@/configs/http.config";
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

export interface UserInfo{
    id: string,
    username: string,
    email: string,
    displayName?: string,
    avatarUrl?: string,
    lat?: number,
    lng?: number,
    budget?: number,
    createdAt: Date,
    updatedAt: Date,
    reviewCount?: number,
    averageRating?: number,
    favCuisines?: Cuisine[]
}

export const getCurrentUserInfo = async (): Promise<UserInfo> => {
    const response = await httpClient.get(getUrl("/api/user"));
    return response.data as UserInfo;
}
