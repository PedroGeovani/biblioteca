import { QueryParams } from "@/models/query-params.model";
import { RentTo } from "@/models/rent.model";
import api from "@/service/api-Config/rxjs-config";
import { Observable } from "rxjs";

export class RentRest {
  getAllRents(params: QueryParams) {
    return api.get("/rents", params);
  }

  getRentsPerPage(params: QueryParams) {
    return api.get("/rents", params);
  }

  findByIdRent(idRent: string) {
    return api.get(`/rents/${idRent}`);
  }

  createRent(idBook: RentTo) {
    return api.post("/rents", idBook);
  }

  deleteRent(idRent?: string) {
    return api.deleteR(`/rents/${idRent}`);
  }

  returnRent(idRent: string): Observable<any> {
    return api.patch(`/rents/returnal/${idRent}`, "/api");
  }
}
