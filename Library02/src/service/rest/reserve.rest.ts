import { Observable } from "rxjs";
import api from "../../service/api-Config/rxjs-config";
import { QueryParams } from "@/models/query-params.model";

export class ReserveRest {
    getReserveById(id: string): Observable<any> {
        return api.get(`/reserves/${id}`);
    }
    getReserves(params?: QueryParams): Observable<any> {
        return api.get(`/reserves`, params);
    }
    deleteReserve(id: string): Observable<any> {
        return api.deleteR(`/reserves/${id}`);
    }
    createReserve(bookID: string): Observable<any> {
        return api.post(`/reserves/`, { bookID: bookID });
    }
    updateReserve(id: string, bookID: string): Observable<any> {
        return api.put(`/reserves/${id}`, { bookID: bookID });
    }
}