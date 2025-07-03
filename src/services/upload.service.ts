"use server"
import httpClient, {getUrl} from "@/configs/http.config";

export interface UploadedFile {
    filename: string;
    url: string;
    size: number;
    mimetype: string;
}

export const uploadFile = async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpClient.post(getUrl("/api/upload"), formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data as  UploadedFile;
};

