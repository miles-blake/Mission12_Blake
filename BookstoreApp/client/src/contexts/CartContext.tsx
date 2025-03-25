import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart } from '../types/Cart';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../services/CartService';

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
    addItem: (bookId: number, quantity?: number) => Promise<void>;
    updateItem: (bookId: number, quantity: number) => Promise<void>;
    removeItem: (bookId: number) => Promise<void>;
    emptyCart: () => Promise<void>;
    lastPageVisited: string;
    setLastPageVisited: (page: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastPageVisited, setLastPageVisited] = useState<string>('/');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await getCart();
            setCart(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch cart');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (bookId: number, quantity: number = 1) => {
        try {
            setLoading(true);
            const updatedCart = await addToCart(bookId, quantity);
            setCart(updatedCart);
            setError(null);
        } catch (err) {
            setError('Failed to add item to cart');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (bookId: number, quantity: number) => {
        try {
            setLoading(true);
            const updatedCart = await updateCartItem(bookId, quantity);
            setCart(updatedCart);
            setError(null);
        } catch (err) {
            setError('Failed to update cart item');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (bookId: number) => {
        try {
            setLoading(true);
            const updatedCart = await removeFromCart(bookId);
            setCart(updatedCart);
            setError(null);
        } catch (err) {
            setError('Failed to remove item from cart');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const emptyCart = async () => {
        try {
            setLoading(true);
            const updatedCart = await clearCart();
            setCart(updatedCart);
            setError(null);
        } catch (err) {
            setError('Failed to clear cart');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        cart,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        emptyCart,
        lastPageVisited,
        setLastPageVisited
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
