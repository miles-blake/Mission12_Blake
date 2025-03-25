import React from 'react';
import { Container, Table, Button, Form, Alert, Card } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
    const { cart, loading, error, updateItem, removeItem, lastPageVisited } = useCart();
    const navigate = useNavigate();

    if (loading) {
        return <div className="text-center mt-5">Loading cart...</div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <Container className="mt-4">
                <h1 className="text-center mb-4">Shopping Cart</h1>
                <Alert variant="info">
                    Your cart is empty. <Button variant="link" onClick={() => navigate('/')}>Continue shopping</Button>
                </Alert>
            </Container>
        );
    }

    const handleQuantityChange = (bookId: number, quantity: number) => {
        updateItem(bookId, quantity);
    };

    const handleRemoveItem = (bookId: number) => {
        removeItem(bookId);
    };

    const handleContinueShopping = () => {
        navigate(lastPageVisited || '/');
    };

    const totalPrice = cart.items.reduce((total, item) => {
        const itemPrice = item.price || (item.unitPrice * item.quantity);
        return total + (isNaN(itemPrice) ? 0 : itemPrice);
    }, 0);

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Shopping Cart</h1>
            
            <Table striped bordered hover responsive>
                <thead className="bg-primary text-white">
                    <tr>
                        <th>Book</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.items.map((item) => (
                        <tr key={item.bookId}>
                            <td>
                                <div>
                                    <strong>{item.book.title}</strong>
                                </div>
                                <div className="text-muted">
                                    by {item.book.author}
                                </div>
                            </td>
                            <td>${(item.book?.price || item.unitPrice).toFixed(2)}</td>
                            <td style={{ width: '150px' }}>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.bookId, parseInt(e.target.value))}
                                />
                            </td>
                            <td>${(item.price || (item.unitPrice * item.quantity)).toFixed(2)}</td>
                            <td>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleRemoveItem(item.bookId)}
                                >
                                    <i className="bi bi-trash"></i> Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3} className="text-end fw-bold">Total:</td>
                        <td colSpan={2} className="fw-bold">${totalPrice.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </Table>
            
            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={handleContinueShopping}>
                    <i className="bi bi-arrow-left me-2"></i> Continue Shopping
                </Button>
                
                <Button variant="success">
                    <i className="bi bi-credit-card me-2"></i> Proceed to Checkout
                </Button>
            </div>
        </Container>
    );
};

export default Cart;
