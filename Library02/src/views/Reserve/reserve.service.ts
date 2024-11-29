import { catchError, Observable, of, Subject, take } from "rxjs";
import { ReserveRest } from "@/service/rest/reserve.rest";
import { QueryParams } from "@/models/query-params.model";

export class ReserveService {

    constructor(
        private _reserve = new ReserveRest(),
    ) { }

    private allReserves$: Subject<any> = new Subject<any>();
    allReserves: Observable<any> = this.allReserves$.asObservable();

    private reserve$: Subject<any> = new Subject<any>();
    reserve: Observable<any> = this.reserve$.asObservable();

    getReserves(params?: QueryParams): void {
        this._reserve
            .getReserves(params)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    this.allReserves$.next(response);
                },
                error: (err) => {
                    this.allReserves$.error(err);
                }
            })
    }

    getReserveById(id: string): void {
        this._reserve
            .getReserveById(id)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    this.reserve$.next(response);
                },
                error: (err) => {
                    this.reserve$.error(err);
                }
            })
    }

    deleteReserve(id: string): void {
        this._reserve
            .deleteReserve(id)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    this.reserve$.next(response);
                },
                error: (err) => {
                    this.reserve$.error(err);
                }
            })
    }

    createReserve(bookId: string): void {
        this._reserve
            .createReserve(bookId)
            .pipe(take(1), catchError(() => of(null)))
            .subscribe({
                next: (response) => {
                    this.reserve$.next(response);
                }
            })
    }

    updateReserve(id: string, bookID: string): void {
        this._reserve
            .updateReserve(id, bookID)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    this.reserve$.next(response);
                },
                error: (err) => {
                    this.reserve$.error(err);
                }
            })
    }
}
