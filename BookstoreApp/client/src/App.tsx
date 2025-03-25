import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookList from './components/BookList';
import Cart from './components/Cart';
import { CartProvider } from './contexts/CartContext';
import { Navbar, Container, Nav } from 'react-bootstrap';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-3">
            <Container>
              <Navbar.Brand href="/">Bookstore</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="/">Books</Nav.Link>
                  <Nav.Link href="/cart">Cart</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
