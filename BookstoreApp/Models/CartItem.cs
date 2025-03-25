using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookstoreApp.Models
{
    public class CartItem
    {
        [Key]
        public int CartItemId { get; set; }
        
        public Book Book { get; set; }
        
        public int BookId { get; set; }
        
        public int Quantity { get; set; }
        
        // Store the price directly to avoid serialization issues
        public decimal UnitPrice { get; set; }
        
        [JsonIgnore]
        public decimal Price => Book?.Price * Quantity ?? UnitPrice * Quantity;
    }
}
