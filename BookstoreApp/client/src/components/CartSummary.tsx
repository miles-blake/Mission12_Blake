import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSummary: React.FC = () => {
    const { cart } = useCart();
    const navigate = useNavigate();

    const totalItems = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
    const totalPrice = cart?.items.reduce((total, item) => {
        const itemPrice = item.price || (item.unitPrice * item.quantity);
        return total + (isNaN(itemPrice) ? 0 : itemPrice);
    }, 0) || 0;

    const handleViewCart = () => {
        navigate('/cart');
    };

    return (
        <div className="d-flex align-items-center">
            <Button 
                variant="outline-primary" 
                className="d-flex align-items-center" 
                onClick={handleViewCart}
                disabled={totalItems === 0}
            >
                <i className="bi bi-cart me-2"></i>
                Cart <Badge bg="secondary" className="ms-1">{totalItems}</Badge>
            </Button>
            {totalItems > 0 && (
                <span className="ms-2 text-success fw-bold">${totalPrice.toFixed(2)}</span>
            )}
        </div>
    );
};

export default CartSummary;
