export class AuthResponse {
  constructor(
    public id?: string,
    public role?: UserRole,
    public token?: string,
    public userName?: string
  ) { }
}

export class AuthRequest {
  constructor(
      public password: string,
      public username: string
  ) { }
}

export enum UserRole {
  ADMINISTRADOR = "ADMINISTRATOR",
  ESTUDANTE = "STUDENT"
}