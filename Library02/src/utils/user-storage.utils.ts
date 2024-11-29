import { AuthResponse } from "@/models/login.model";
import LocalStorage from "./local-storage.utils";
import { User } from "@/models/user.model";

export function getUser(): AuthResponse | undefined {
  const storage = new LocalStorage();
  const user = storage.getItem("user") as AuthResponse;
  if (user) return user;
  else null;
}

export function setUser(userData: AuthResponse): void {
  const storage = new LocalStorage();
  storage.setItem("user", userData);
}

export function getUserToEdit(): User | undefined {
  const storage = new LocalStorage()
  const user = storage.getItem("edit") as User
  if (user) return user;
  else null;
}

export function getUserRole(): string | undefined {
  return getUser()?.role;
}

export function getUserToken(): string | undefined {
  return getUser()?.token;
}

export function removeUser(): void {
  const storage = new LocalStorage()
  storage.removeItem("user")
}
