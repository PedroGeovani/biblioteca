import LocalStorage from "./local-storage.utils";
import { jwtDecode } from "jwt-decode";

export class UserStorage {
    constructor(private localStorage = new LocalStorage()) { }

    getToken(): any {
        const { token } = this.localStorage.getItem("user") as { token: string } || {};
        if (token) {
            const tokenDecoded = jwtDecode<object>(token);
            return tokenDecoded;
        }
    }
    getEmail(): void | string {
        const token = this.getToken();
        if (token && typeof token === "object" && "email" in token) {
            return token.email as string;
        }
    }
    getName(): void | string {
        const token = this.getToken();
        if (token && typeof token === "object" && "UserName" in token) {
            return token.UserName as string;
        }
    }
}