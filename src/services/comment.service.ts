/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import httpClient, { getUrl } from "@/configs/http.config";

// Type definitions
export interface Comment {
  id: number;
  postId: number;
  userId: string;
  replyToId?: number;
  content: string;
  media?: any;
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface CreateCommentParams {
  content: string;
  replyToId?: number;
  media?: any;
}

// Get comments for a post
export const getCommentsByPost = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await httpClient.get(getUrl(`/api/post/${postId}/comments`));
    return response.data ?? [];
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return [];
  }
};

// Create a new comment
export const createComment = async (postId: number, comment: CreateCommentParams): Promise<Comment | null> => {
  try {
    const response = await httpClient.post(getUrl(`/api/post/${postId}/comments`), comment);
    return response.data;
  } catch (error) {
    console.error(`Error creating comment for post ${postId}:`, error);
    return null;
  }
};

// Delete a comment
export const deleteComment = async (commentId: number): Promise<{ deleted: boolean; commentId: number }> => {
  try {
    await httpClient.delete(getUrl(`/api/comments/${commentId}`));
    return { deleted: true, commentId };
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    return { deleted: false, commentId };
  }
};

// Reply to a comment
export const replyToComment = async (postId: number, parentCommentId: number, content: string): Promise<Comment | null> => {
  try {
    const response = await httpClient.post(getUrl(`/api/post/${postId}/comments`), {
      content,
      replyToId: parentCommentId
    });
    return response.data;
  } catch (error) {
    console.error(`Error replying to comment ${parentCommentId}:`, error);
    return null;
  }
};
