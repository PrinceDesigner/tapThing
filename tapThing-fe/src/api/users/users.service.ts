import { apiClient } from "../apiClient";
import { User } from "./model/user.model";


export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>("users/me");
}

export async function updateCurrentUser(dto: Partial<User>) {
  return apiClient.post("users/modifica", dto);
}
