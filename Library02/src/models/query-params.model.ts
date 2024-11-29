export class QueryParams {
    constructor(
        public page: number = 0,
        public size: number = 5,
        public title?: string,
        public isbn?: string,
        public dateReserveAvailable?: Date,
        public id?: string,
        public rentId?: string, 
        public status?: string,
        public author?: string,
        public user?: string,
        public totalQuantity?: number,
        public bookID?: string,
    ) { }
}
