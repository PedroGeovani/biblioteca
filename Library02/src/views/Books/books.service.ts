import { Subject, Observable } from "rxjs";
import { BooksRest } from "@/service/rest/books.rest";
import { Book } from "@/models/book-page.model";
import { QueryParams } from "@/models/query-params.model";

export class BookService {
    constructor(private _books = new BooksRest()) { }

    private books$: Subject<any> = new Subject<any>();
    private modifierBook$: Subject<any> = new Subject<any>();

    books: Observable<any> = this.books$.asObservable();
    modifierBook: Observable<any> = this.modifierBook$.asObservable();

    getBooksPerPage(pageParams: QueryParams): void {
        this._books.getBooksPerPage(pageParams)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.books$.next(response);
                },
                error: (err) => {
                    this.books$.next(err);
                }
            });
    }

    createBook(newBook: Book): void {
        this._books.createBook(newBook)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.books$.next(response);
                },
                error: (err) => {
                    this.books$.next(err);
                }
            });
    }

    updateBook(bookId: string, editedBook: Book): void {
        this._books.updateBook(bookId, editedBook)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.modifierBook$.next(response);
                },
                error: (err) => {
                    this.modifierBook$.next(err);
                }
            });
    }
}