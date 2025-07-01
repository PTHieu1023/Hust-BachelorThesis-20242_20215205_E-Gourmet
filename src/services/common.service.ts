"use server"

import httpClient from "@/configs/http.config";

export async function uploadFiles(file: File | null | undefined) {
    if (!file) {
        throw new Error("No file provided for upload");
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await httpClient.post("/api/upload", formData);
    return res.data;
}
