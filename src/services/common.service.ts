"use server"

import httpClient, { getUrl } from "@/configs/http.config";

export interface CommonListResponse<T> {
    data: T[];
    total?: number;
    page?: number;
    limit?: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

// Common error handling
export const handleApiError = (error: unknown): never => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { error?: string; message?: string } } };
        if (err.response?.data?.error) {
            throw new Error(err.response.data.error);
        }
        if (err.response?.data?.message) {
            throw new Error(err.response.data.message);
        }
    }
    if (error instanceof Error) {
        throw new Error(error.message ?? "An unexpected error occurred");
    }
    throw new Error("An unexpected error occurred");
}

// Helper function for API calls with error handling
export const apiCall = async <T>(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    data?: unknown,
    params?: Record<string, unknown>
): Promise<T> => {
    try {
        let response;
        const url = getUrl(endpoint);
        
        switch (method) {
            case 'get':
                response = await httpClient.get(url, { params });
                break;
            case 'post':
                response = await httpClient.post(url, data, { params });
                break;
            case 'put':
                response = await httpClient.put(url, data, { params });
                break;
            case 'delete':
                response = await httpClient.delete(url, { params });
                break;
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }
        
        return response.data as T;
    } catch (error) {
        return handleApiError(error);
    }
}

export async function uploadFiles(file: File | null | undefined) {
    if (!file) {
        throw new Error("No file provided for upload");
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await httpClient.post("/api/upload", formData);
    return res.data;
}
