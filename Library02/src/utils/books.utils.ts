import { Book } from "@/models/book-page.model";

export class BookUtil {

    verifySelectedFilters(filteredGroup: any): Book {
        let filter = new Book();
        if (filteredGroup.selectedAuthor !== '') {
            filter.author = filteredGroup.selectedAuthor;
        }
        if (filteredGroup.selectedIsbn !== '') {
            filter.isbn = filteredGroup.selectedIsbn;
        }
        if (filteredGroup.selectedTitle !== '') {
            filter.title = filteredGroup.selectedTitle;
        }
        filter.status = this.verifySelectedStatus(filteredGroup.selectedStatus.name);
        return filter;
    }

    translateStatusToPTBR(valueStatus: string): string {
        let status: string = '';
        if (valueStatus === 'AVAILABLE') {
            status = 'Disponível';
        } else if (valueStatus === 'UNAVAILABLE') {
            status = 'Indisponível';
        } else if (valueStatus === 'LOANED') {
            status = 'Emprestado';
        }
        return status;
    }

    verifySelectedStatus(valueStatus: string): string | undefined {
        let status: string | undefined;
        if (valueStatus === 'Disponível') {
            status = 'AVAILABLE';
        } else if (valueStatus === 'Indisponível') {
            status = 'UNAVAILABLE';
        } else if (valueStatus === 'Emprestado') {
            status = 'LOANED';
        }
        return status;
    }
}
