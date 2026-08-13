import api from "./api";
import {
  saveToken,
  removeToken,
} from "../lib/storage";

export type UserRole = "client" | "agent";

export interface User {
  id: number;
  fullname: string;
  email: string;
  role: UserRole;
  isOnline?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullname: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export async function login(
  data: LoginData
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );

  await saveToken(response.data.token);

  return response.data;
}

export async function register(
  data: RegisterData
): Promise<User> {
  const response = await api.post<User>(
    "/auth/register",
    data
  );

  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");

  return response.data;
}

export async function logout(): Promise<void> {
  await removeToken();
}