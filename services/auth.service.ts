import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "demo";
};

export type LoginInput = {
  email: string;
  password: string;
};

export async function login(input: LoginInput) {
  const response = await api.post<ApiResponse<AuthUser>>("/auth/login", input);
  return response.data.data;
}

export async function loginAsDemo() {
  const response = await api.post<ApiResponse<AuthUser>>("/auth/demo-login");
  return response.data.data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function getCurrentUser() {
  const response = await api.get<ApiResponse<AuthUser>>("/auth/me");
  return response.data.data;
}

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "me"] as const,
};
