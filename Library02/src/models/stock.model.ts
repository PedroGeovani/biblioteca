import { Book } from "./book-page.model";

export class Stock {
    constructor(
        public id?: string,
        public totalQuantity?: number,
        public availableQuantity?: number,
        public book?: Book,
    ) { }
}

export class StockTo {
    constructor(
        public bookID?: string,
        public totalQuantity?: number,
    ) { }
}







