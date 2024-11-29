import { UserRole } from "./login.model";

export class User {
    constructor(
        public email?: string,
        public password?: string,
        public confirmPassword?: string,
        public name?: string,
        public phone?: string,
        public role?: UserRole,
        public id?: string
    ) { }
}