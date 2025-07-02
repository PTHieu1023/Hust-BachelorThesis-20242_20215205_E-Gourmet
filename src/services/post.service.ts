"use server";

import httpClient, {getUrl} from "@/configs/http.config";

export interface Post {
    id: string;
    caption?: string;
    media?: string[];
    createdAt: Date;
    updatedAt: Date;
    restaurantId: number;
    restaurantName: string;
    restaurantAvatar?: string;
    restaurantUsername: string;
    likeCount: number;
    commentCount: number;
}

export interface CreatePostParams {
    caption?: string;
    media?: string[];
    restaurantId: number;
}

export interface PostListParams {
    page?: number;
    limit?: number;
}

export const fetchPosts = async (params?: PostListParams): Promise<Post[]> => {
    const response = await httpClient.get(getUrl("/api/post"), { params });
    return response.data as Post[];
}

export const createPost = async (params: CreatePostParams): Promise<Post> => {
    const response = await httpClient.post(getUrl("/api/post"), params);
    return response.data as Post;
}
