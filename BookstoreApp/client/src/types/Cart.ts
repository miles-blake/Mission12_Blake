import { Book } from './Book';

export interface CartItem {
    cartItemId: number;
    book: Book;
    bookId: number;
    quantity: number;
    unitPrice: number;
    price: number;
}

export interface Cart {
    items: CartItem[];
    total?: number;
    totalQuantity?: number;
}
