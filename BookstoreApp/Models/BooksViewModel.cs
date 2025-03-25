using System.Collections.Generic;

namespace BookstoreApp.Models
{
    public class BooksViewModel
    {
        public IEnumerable<Book> Books { get; set; }
        public PaginationInfo PaginationInfo { get; set; }
        public string? SortColumn { get; set; }
        public string? SortDirection { get; set; }
        public string? SelectedCategory { get; set; }
    }
}
