import { User } from "./user.model";
import { Book } from "./book-page.model";

export class Reserve {
    constructor(
        public id?: string,
        public dateReserveAvailable?: Date,
        public dateReserveCreated?: Date,
        public reserveStatus?: ReserveStatus,
        public book?: Book,
        public user?: User
    ) { }
}
export enum ReserveStatus {
    AVAILABLE = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE"
}

