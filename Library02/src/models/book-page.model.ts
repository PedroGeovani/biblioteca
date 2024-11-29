import { Category } from "./category.model";

export class Book {
    constructor(
        public author?: string,
        public id?: string,
        public isbn?: string,
        public listCategories?: Category[],
        public publicationDate?: string,
        public publisher?: string,
        public status?: string,
        public title?: string
    ) { }
}

export enum Status {
    "AVAILABLE", "LOANED", "UNAVAILABLE"
}
