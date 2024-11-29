import { QueryParams } from "@/models/query-params.model";
import { RentTo } from "@/models/rent.model";
import { RentRest } from "@/service/rest/rent.rest";
import { BehaviorSubject, Observable, take } from "rxjs";

export class RentService {
  constructor(private _rent = new RentRest()) {}

  private rent$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  rent: Observable<any> = this.rent$.asObservable();

  private rentAll$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  rentAll: Observable<any> = this.rentAll$.asObservable();

  private rentReturn$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  rentReturn: Observable<any> = this.rentReturn$.asObservable();

  getAllRents(params: QueryParams) {
    this._rent
      .getAllRents(params)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.rentAll$.next(response);
        },
        error: (error) => {
          return error;
        },
      });
  }

  getRentsPerPage(params: QueryParams) {
    this._rent
      .getRentsPerPage(params)
      .pipe()
      .subscribe({
        next: (response: any) => {
          this.rent$.next(response);
        },
        error: (error) => {
          return error;
        },
      });
  }

  findByIdRent(idRent: string) {
    this._rent
      .findByIdRent(idRent)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.rent$.next(response);
        },
        error: (error) => {
          return error;
        },
      });
  }

  createRent(newRent: RentTo) {
    this._rent
      .createRent(newRent)
      .pipe()
      .subscribe({
        next: () => {},
        error: (error) => {
          return error;
        },
      });
  }

  deleteRent(idRent?: string) {
    this._rent
      .deleteRent(idRent)
      .pipe(take(1))
      .subscribe({
        next: () => {
        },
        error: (error) => {
          return error;
        },
      });
  }

  returnRent(idRent: string): any {
    this._rent
      .returnRent(idRent)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.rentReturn$.next(response);
        },
        error: (error) => {
          return error;
        },
      });
  }
}
