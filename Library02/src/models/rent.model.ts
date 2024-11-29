import { Book } from "./book-page.model";
import { User } from "./user.model";

export class Rent {
  constructor(
    public book?: Book,
    public countRent?: number,
    public id?: string,
    public rentDate?: string,
    public rentFinalDate?: string,
    public status?: StatusRent,
    public user?: User
  ) { }
}

export class Categories {
  constructor(
    public id?: string, 
    public name?: string
  ) { }
}

export class PageToRent {
  constructor(
    public content?: Rent[],
    public page?: number,
    public size?: number,
    public total?: number
  ) { }
}

export class RentTo {
  constructor(
    public bookId: string
  ) { }
}

export enum StatusRent {
  "ACTIVE",
  "INACTIVE"
}