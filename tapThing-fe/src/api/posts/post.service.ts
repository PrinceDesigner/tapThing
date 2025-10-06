import { apiClient } from "../apiClient";
import { Post, PostDetail, ResponsePostPaginated } from "./model/post.model";

export async function insertPost(url_image: string, prompt_id: string, lat: number | null, lng: number | null, country: string | null, city: string | null): Promise<{id: string, created_at: string}> {
    return apiClient.post(`posts/add`, {
        url: url_image,
        promptid: prompt_id,
        lat,
        lng,
        country,
        city
    });
}

export async function getPostById(id: string): Promise<PostDetail> {
    return apiClient.get(`posts/${id}`);
}

export const getPosts = async (
  storeId: string,
  limit: number,
  offset: number
): Promise<ResponsePostPaginated> => {


  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  qs.set("offset", String(offset));
  qs.set("prompt_id", storeId);

  const response = apiClient.get<ResponsePostPaginated>(`posts/paginated/get?${qs.toString()}`);

  return response;
};

