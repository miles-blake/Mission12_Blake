import React, { useEffect, useState } from 'react';
import { Table, Pagination, Form } from 'react-bootstrap';
import { getBooks } from '../services/BookService';
import { Book, BooksResponse } from '../types/Book';

const BookList: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [booksData, setBooksData] = useState<BooksResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [sortColumn, setSortColumn] = useState<string>('Title');
    const [sortDirection, setSortDirection] = useState<string>('asc');

    useEffect(() => {
        fetchBooks();
    }, [currentPage, itemsPerPage, sortColumn, sortDirection]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await getBooks(currentPage, itemsPerPage, sortColumn, sortDirection);
            setBooksData(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
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
        <div className="container mt-4">
            <h1 className="text-center mb-4">Bookstore Catalog</h1>
            
            <div className="d-flex justify-content-end mb-3">
                <Form.Group style={{ width: '200px' }}>
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
            </div>
            
            <Table striped bordered hover responsive>
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
                            <td>{book.category}</td>
                            <td>{book.pageCount}</td>
                            <td>${book.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            
            {renderPagination()}
            
            {booksData && (
                <div className="text-center mt-2">
                    Showing {booksData.books.length} of {booksData.paginationInfo.totalItems} books
                </div>
            )}
        </div>
    );
};

export default BookList;
