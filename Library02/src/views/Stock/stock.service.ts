import { BehaviorSubject, catchError, map, Observable, of, Subject, take } from "rxjs";
import { StockRest } from "@/service/rest/stock.rest"; 
import { QueryParams } from "@/models/query-params.model";
import { Stock } from "@/models/stock.model";
import { BooksRest } from "@/service/rest/books.rest";


export class StockService {
    constructor(
        private _stockModify = new StockRest(),
        private _stock = new StockRest(),  
        private _book = new BooksRest(),      
    ) { }

    private stock$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    private stockModify$: Subject<any> = new Subject<any>();    
    private book$: Subject<any> = new Subject<any>();

    stock: Observable<any> = this.stock$.asObservable();
    stockModify: Observable<any> = this.stockModify$.asObservable();
    book: Observable<any> = this.book$.asObservable();

    
    getBookPerIsbn(params: QueryParams) {
        this._book.getBookPerIsbn(params)
            .pipe()
            .subscribe({
                next: (response) => {
                    this.book$.next(response);
                },
                error: (error) => {
                    return error;
                }
            });
    }
    getAllStock(params: QueryParams) {
        this._stock.getAllStock(params)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    this.stock$.next(response);
                },
                error: (error) => {
                    return error;
                }
            });
    }
    
    getStockById(idBook: string) {
        this._stockModify.getStockById(idBook)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    this.stockModify$.next(response);
                },
                error: (error) => {
                    return error;
                }
            });
    }

    updateStock(id: string, body: Stock) {
        this._stockModify.updateStock(id, body)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    this.stockModify$.next(response);
                },
                error: (error) => {
                    return error;
                }
            });
    }   
    
    postBookToStock(body: Stock) {
        this._stockModify.postBookToStock(body)
            .pipe(
                take(1),                
                catchError(() => of(null))
            )                
            .subscribe({
                    next: (response) => {
                        this.stockModify$.next(response);
                    },
            });
    }  
    
    deleteStock(id: string) {
        this._stockModify.deleteStock(id)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    this.stockModify$.next(response);
                },
            });
    }
}