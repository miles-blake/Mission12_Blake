using System.Collections.Generic;
using System.Linq;

namespace BookstoreApp.Models
{
    public class Cart
    {
        public List<CartItem> Items { get; set; } = new List<CartItem>();
        
        public void AddItem(Book book, int quantity = 1)
        {
            var existingItem = Items.FirstOrDefault(i => i.BookId == book.BookID);
            
            if (existingItem != null)
            {
                // Update quantity if item already exists
                existingItem.Quantity += quantity;
            }
            else
            {
                // Add new item
                Items.Add(new CartItem
                {
                    Book = book,
                    BookId = book.BookID,
                    Quantity = quantity,
                    UnitPrice = book.Price
                });
            }
        }
        
        public void RemoveItem(int bookId)
        {
            var item = Items.FirstOrDefault(i => i.BookId == bookId);
            if (item != null)
            {
                Items.Remove(item);
            }
        }
        
        public void UpdateQuantity(int bookId, int quantity)
        {
            var item = Items.FirstOrDefault(i => i.BookId == bookId);
            if (item != null)
            {
                if (quantity > 0)
                {
                    item.Quantity = quantity;
                }
                else
                {
                    RemoveItem(bookId);
                }
            }
        }
        
        public void Clear()
        {
            Items.Clear();
        }
        
        public decimal GetTotal()
        {
            return Items.Sum(i => i.Price);
        }
        
        public int GetTotalQuantity()
        {
            return Items.Sum(i => i.Quantity);
        }
    }
}
