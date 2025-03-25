import React, { useEffect, useState } from 'react';
import { Table, Pagination, Form, Button, Row, Col, Card, Badge, Container } from 'react-bootstrap';
import { getBooks, getCategories } from '../services/BookService';
import { Book, BooksResponse } from '../types/Book';
import { useCart } from '../contexts/CartContext';
import CartSummary from './CartSummary';
import { useLocation } from 'react-router-dom';

const BookList: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [booksData, setBooksData] = useState<BooksResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [sortColumn, setSortColumn] = useState<string>('Title');
    const [sortDirection, setSortDirection] = useState<string>('asc');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);
    const { addItem, setLastPageVisited } = useCart();
    const location = useLocation();

    useEffect(() => {
        fetchBooks();
    }, [currentPage, itemsPerPage, sortColumn, sortDirection, selectedCategory]);

    useEffect(() => {
        // Save current page location for "Continue Shopping" functionality
        setLastPageVisited(location.pathname + location.search);
    }, [location, setLastPageVisited]);

    useEffect(() => {
        // Extract unique categories from all books
        const fetchAllCategories = async () => {
            try {
                // Fetch all books without pagination to get all categories
                const data = await getBooks(1, 100, 'Title', 'asc');
                if (data?.books) {
                    const uniqueCategories = Array.from(
                        new Set(data.books.map(book => book.category))
                    ).sort();
                    setCategories(uniqueCategories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        
        fetchAllCategories();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await getBooks(
                currentPage, 
                itemsPerPage, 
                sortColumn, 
                sortDirection,
                selectedCategory === 'all' ? undefined : selectedCategory
            );
            setBooksData(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1); // Reset to first page when changing category
    };

    const handleAddToCart = (book: Book) => {
        addItem(book.bookID);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            // Toggle sort direction if clicking the same column
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Default to ascending order for a new column
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (column: string) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'asc' ? ' ▲' : ' ▼';
    };

    const renderPagination = () => {
        if (!booksData) return null;
        
        const { paginationInfo } = booksData;
        const items = [];

        for (let number = 1; number <= paginationInfo.totalPages; number++) {
            items.push(
                <Pagination.Item 
                    key={number} 
                    active={number === paginationInfo.currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        return (
            <Pagination className="justify-content-center mt-3">
                <Pagination.Prev 
                    onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                    disabled={paginationInfo.currentPage === 1}
                />
                {items}
                <Pagination.Next 
                    onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                    disabled={paginationInfo.currentPage === paginationInfo.totalPages}
                />
            </Pagination>
        );
    };

    if (loading && !booksData) {
        return <div className="text-center mt-5">Loading books...</div>;
    }

    return (
        <Container fluid className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h1 className="text-center">Bookstore Catalog</h1>
                </Col>
            </Row>
            
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Filter by Category:</Form.Label>
                        <Form.Select 
                            value={selectedCategory} 
                            onChange={handleCategoryChange}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Books per page:</Form.Label>
                        <Form.Select 
                            value={itemsPerPage} 
                            onChange={handleItemsPerPageChange}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end justify-content-end">
                    <CartSummary />
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th onClick={() => handleSort('Title')} style={{ cursor: 'pointer' }}>
                                        Title {renderSortIcon('Title')}
                                    </th>
                                    <th onClick={() => handleSort('Author')} style={{ cursor: 'pointer' }}>
                                        Author {renderSortIcon('Author')}
                                    </th>
                                    <th onClick={() => handleSort('Publisher')} style={{ cursor: 'pointer' }}>
                                        Publisher {renderSortIcon('Publisher')}
                                    </th>
                                    <th>ISBN</th>
                                    <th onClick={() => handleSort('Classification')} style={{ cursor: 'pointer' }}>
                                        Classification {renderSortIcon('Classification')}
                                    </th>
                                    <th onClick={() => handleSort('Category')} style={{ cursor: 'pointer' }}>
                                        Category {renderSortIcon('Category')}
                                    </th>
                                    <th onClick={() => handleSort('PageCount')} style={{ cursor: 'pointer' }}>
                                        Pages {renderSortIcon('PageCount')}
                                    </th>
                                    <th onClick={() => handleSort('Price')} style={{ cursor: 'pointer' }}>
                                        Price {renderSortIcon('Price')}
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {booksData?.books.map((book: Book) => (
                                    <tr key={book.bookID}>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.publisher}</td>
                                        <td>{book.isbn}</td>
                                        <td>{book.classification}</td>
                                        <td>
                                            <Badge bg="info" pill>
                                                {book.category}
                                            </Badge>
                                        </td>
                                        <td>{book.pageCount}</td>
                                        <td>${book.price.toFixed(2)}</td>
                                        <td>
                                            <Button 
                                                variant="success" 
                                                size="sm"
                                                onClick={() => handleAddToCart(book)}
                                            >
                                                <i className="bi bi-cart-plus me-1"></i> Add to Cart
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
            
            <Row>
                <Col>
                    {renderPagination()}
                </Col>
            </Row>
            
            <Row>
                <Col>
                    {booksData && (
                        <div className="text-center mt-2">
                            Showing {booksData.books.length} of {booksData.paginationInfo.totalItems} books
                            {selectedCategory !== 'all' && (
                                <span> in category <Badge bg="info">{selectedCategory}</Badge></span>
                            )}
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default BookList;
