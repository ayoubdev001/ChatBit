export type UserRole = "client" | "agent";

export interface User {
  id: number;
  fullname: string;
  email: string;
  role: UserRole;
  isOnline: boolean;
  createdAt: string;
}