export interface Book {
    bookID: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    category: string;
    pageCount: number;
    price: number;
}

export interface PaginationInfo {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
}

export interface BooksResponse {
    books: Book[];
    paginationInfo: PaginationInfo;
    sortColumn: string;
    sortDirection: string;
}
