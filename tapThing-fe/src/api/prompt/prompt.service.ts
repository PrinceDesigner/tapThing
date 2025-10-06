import { apiClient } from "../apiClient";
import { Prompt } from "./model/prompt.model";

export async function getPromptByIdUser(): Promise<Prompt | null> {
    const response = await apiClient.get<Prompt | null>(`prompt/prompt_active`);
    console.log("Fetching active prompt for user...", response);
    return response;
}