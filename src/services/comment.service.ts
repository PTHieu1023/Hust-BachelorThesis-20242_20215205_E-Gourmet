"use server"

import httpClient, { getUrl } from "@/configs/http.config";
import { AxiosError } from "axios";
import { toast } from "sonner";

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

// Error handling utility
const handleCommentError = (error: AxiosError): never => {
  if (error.response?.data) {
    const responseData = error.response.data as any;
    const errorMessage = responseData.message || responseData.error || "An error occurred";
    toast.error(errorMessage);
  } else {
    toast.error("Failed to connect to the server");
  }
  throw error;
};

// Get comments for a post
export const getCommentsByPost = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await httpClient.get(getUrl(`/api/post/${postId}/comments`));
    return response.data?.data || [];
  } catch (error) {
    return handleCommentError(error as AxiosError);
  }
};

// Create a new comment
export const createComment = async (postId: number, comment: CreateCommentParams): Promise<Comment> => {
  try {
    const response = await httpClient.post(getUrl(`/api/post/${postId}/comments`), comment);
    return response.data?.data;
  } catch (error) {
    return handleCommentError(error as AxiosError);
  }
};

// Delete a comment
export const deleteComment = async (commentId: number): Promise<{ deleted: boolean; commentId: number }> => {
  try {
    const response = await httpClient.delete(getUrl(`/api/comments/${commentId}`));
    return { deleted: true, commentId };
  } catch (error) {
    return handleCommentError(error as AxiosError);
  }
};

// Reply to a comment
export const replyToComment = async (postId: number, parentCommentId: number, content: string): Promise<Comment> => {
  try {
    const response = await httpClient.post(getUrl(`/api/post/${postId}/comments`), {
      content,
      replyToId: parentCommentId
    });
    return response.data?.data;
  } catch (error) {
    return handleCommentError(error as AxiosError);
  }
};
