import { apiClient } from "../apiClient";
import { Prompt } from "./model/prompt.model";

export async function getPromptByIdUser(): Promise<Prompt | null> {
    const response = await apiClient.get<Prompt | null>(`prompt/prompt_active`);
    return response;
}