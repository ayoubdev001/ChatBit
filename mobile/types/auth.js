import { User } from "./user";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullname: string;
  email: string;
  password: string;
  role: "client" | "agent";
}

export interface AuthResponse {
  user: User;
  token: string;
}