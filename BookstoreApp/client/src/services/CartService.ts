import axios from 'axios';
import { Book } from '../types/Book';
import { Cart } from '../types/Cart';

const API_URL = 'http://localhost:5005/api/cart';

export const getCart = async (): Promise<Cart> => {
    try {
        const response = await axios.get<Cart>(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

export const addToCart = async (bookId: number, quantity: number = 1): Promise<Cart> => {
    try {
        const response = await axios.post<Cart>(`${API_URL}/add/${bookId}?quantity=${quantity}`);
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

export const updateCartItem = async (bookId: number, quantity: number): Promise<Cart> => {
    try {
        const response = await axios.post<Cart>(`${API_URL}/update/${bookId}?quantity=${quantity}`);
        return response.data;
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
};

export const removeFromCart = async (bookId: number): Promise<Cart> => {
    try {
        const response = await axios.delete<Cart>(`${API_URL}/remove/${bookId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
};

export const clearCart = async (): Promise<Cart> => {
    try {
        const response = await axios.post<Cart>(`${API_URL}/clear`);
        return response.data;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};
