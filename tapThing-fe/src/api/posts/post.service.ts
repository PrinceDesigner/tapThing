import { apiClient } from "../apiClient";
import { Post } from "./model/post.model";

export async function insertPost(url_image: string, prompt_id: string): Promise<Omit<Post, 'url_image' | 'prompt_id' | 'user_id'>> {
    return apiClient.post(`posts/add`, {
        url: url_image,
        promptid: prompt_id,
    });
}