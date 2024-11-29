import { Book } from "@/models/book-page.model";
import { QueryParams } from "@/models/query-params.model";
import api from "@/service/api-Config/rxjs-config";

export class BooksRest {
    getBooksPerPage(queryParams: QueryParams) {
        return api.get(`/books`, queryParams);
    }
    
    getBookPerIsbn(queryParams: QueryParams) {
        return api.get(`/books/`, queryParams);
    }

    createBook(newBook: Book) {
        return api.post("/books", newBook);
    }

    updateBook(bookId: string, editedBook: Book) {
        return api.put(`/books/${bookId}`, editedBook);
    }

    deleteBook(bookId: string) {
        return api.deleteR(`/books/${bookId}`);
    }
}
