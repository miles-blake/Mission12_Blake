using Microsoft.AspNetCore.Mvc;
using BookstoreApp.Models;
using System.Linq;

namespace BookstoreApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private IBookstoreRepository _repository;

        public BooksController(IBookstoreRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public ActionResult<BooksViewModel> GetBooks(int pageNumber = 1, int pageSize = 5, string sortColumn = "Title", string sortDirection = "asc")
        {
            // Get total count of books
            var totalItems = _repository.Books.Count();

            // Apply sorting
            var booksQuery = _repository.Books;
            
            booksQuery = sortColumn.ToLower() switch
            {
                "title" => sortDirection.ToLower() == "asc" 
                    ? booksQuery.OrderBy(b => b.Title) 
                    : booksQuery.OrderByDescending(b => b.Title),
                "author" => sortDirection.ToLower() == "asc" 
                    ? booksQuery.OrderBy(b => b.Author) 
                    : booksQuery.OrderByDescending(b => b.Author),
                "publisher" => sortDirection.ToLower() == "asc" 
                    ? booksQuery.OrderBy(b => b.Publisher) 
                    : booksQuery.OrderByDescending(b => b.Publisher),
                "classification" => sortDirection.ToLower() == "asc" 
                    ? booksQuery.OrderBy(b => b.Classification) 
                    : booksQuery.OrderByDescending(b => b.Classification),
                "category" => sortDirection.ToLower() == "asc" 
                    ? booksQuery.OrderBy(b => b.Category) 
                    : booksQuery.OrderByDescending(b => b.Category),
                "pagecount" => sortDirection.ToLower() == "asc" 
                    ? booksQuery.OrderBy(b => b.PageCount) 
                    : booksQuery.OrderByDescending(b => b.PageCount),
                "price" => sortDirection.ToLower() == "asc" 
                    ? booksQuery.OrderBy(b => b.Price) 
                    : booksQuery.OrderByDescending(b => b.Price),
                _ => sortDirection.ToLower() == "asc" 
                    ? booksQuery.OrderBy(b => b.Title) 
                    : booksQuery.OrderByDescending(b => b.Title)
            };

            // Apply pagination
            var books = booksQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Create pagination info
            var paginationInfo = new PaginationInfo
            {
                CurrentPage = pageNumber,
                ItemsPerPage = pageSize,
                TotalItems = totalItems
            };

            // Create view model
            var viewModel = new BooksViewModel
            {
                Books = books,
                PaginationInfo = paginationInfo,
                SortColumn = sortColumn,
                SortDirection = sortDirection
            };

            return viewModel;
        }
    }
}
