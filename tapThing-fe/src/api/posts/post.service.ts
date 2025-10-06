import { apiClient } from "../apiClient";
import { Post, PostDetail, ResponsePostPaginated } from "./model/post.model";

export async function insertPost(url_image: string, prompt_id: string, lat: number | null, lng: number | null, country: string | null, city: string | null): Promise<{ id: string, created_at: string }> {
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
  promptId: string,
  limit: number,
  cursor?: { id: string | null; created_at: string | null } | null,
): Promise<ResponsePostPaginated> => {
  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  qs.set("prompt_id", promptId);

  // Iniziale: nessun cursor → non mandare parametri
  if (cursor?.id) qs.set("cursor_id", cursor.id);
  if (cursor?.created_at) qs.set("cursor_created_at", cursor.created_at);

  const response = await apiClient.get<ResponsePostPaginated>(
    `posts/paginated/get?${qs.toString()}`
  );

  return response;
};

export async function deletePost(id: string): Promise<{ success: boolean }> {
  return apiClient.delete(`posts/${id}`);
}


