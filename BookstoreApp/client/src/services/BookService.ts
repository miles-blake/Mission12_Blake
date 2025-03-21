import axios from 'axios';
import { BooksResponse } from '../types/Book';

const API_URL = 'http://localhost:5005/api/books';

export const getBooks = async (
    pageNumber: number = 1, 
    pageSize: number = 5,
    sortColumn: string = 'Title',
    sortDirection: string = 'asc'
): Promise<BooksResponse> => {
    try {
        const response = await axios.get<BooksResponse>(API_URL, {
            params: {
                pageNumber,
                pageSize,
                sortColumn,
                sortDirection
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};
