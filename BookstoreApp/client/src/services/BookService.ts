import axios from 'axios';
import { BooksResponse } from '../types/Book';

const API_URL = 'http://localhost:5005/api/books';
const CATEGORIES_URL = `${API_URL}/categories`;

export const getBooks = async (
    pageNumber: number = 1, 
    pageSize: number = 5,
    sortColumn: string = 'Title',
    sortDirection: string = 'asc',
    category?: string
): Promise<BooksResponse> => {
    try {
        const response = await axios.get<BooksResponse>(API_URL, {
            params: {
                pageNumber,
                pageSize,
                sortColumn,
                sortDirection,
                category
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

export const getCategories = async (): Promise<string[]> => {
    try {
        const response = await axios.get<string[]>(CATEGORIES_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};
