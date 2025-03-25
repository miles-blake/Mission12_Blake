using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Models
{
    public class CartItem
    {
        [Key]
        public int CartItemId { get; set; }
        
        public Book Book { get; set; }
        
        public int BookId { get; set; }
        
        public int Quantity { get; set; }
        
        public decimal Price => Book.Price * Quantity;
    }
}
