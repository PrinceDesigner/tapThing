import { apiClient } from "../apiClient";
import { Prompt } from "./model/prompt.model";

export async function getPromptByIdUser(): Promise<Prompt | null> {
    return apiClient.get<Prompt | null>(`prompt/prompt_active`);
}