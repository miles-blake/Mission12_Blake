using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using BookstoreApp.Models;
using System.Text.Json;
using System.Linq;
using System.Collections.Generic;

namespace BookstoreApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly IBookstoreRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private const string CartSessionKey = "Cart";

        public CartController(IBookstoreRepository repository, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        private Cart GetCart()
        {
            var session = _httpContextAccessor.HttpContext.Session;
            string cartJson = session.GetString(CartSessionKey);
            
            if (string.IsNullOrEmpty(cartJson))
            {
                return new Cart();
            }
            
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            
            var cart = JsonSerializer.Deserialize<Cart>(cartJson, options);
            
            // Ensure the Items list is initialized
            if (cart.Items == null)
            {
                cart.Items = new List<CartItem>();
            }
            
            // Reload Book objects from the database to ensure they are properly initialized
            foreach (var item in cart.Items)
            {
                if (item.Book == null && item.BookId > 0)
                {
                    item.Book = _repository.Books.FirstOrDefault(b => b.BookID == item.BookId);
                }
            }
            
            // Ensure each item has a valid CartItemId
            int maxId = cart.Items.Any() ? cart.Items.Max(i => i.CartItemId) : 0;
            foreach (var item in cart.Items.Where(i => i.CartItemId == 0))
            {
                item.CartItemId = ++maxId;
            }
            
            return cart;
        }

        private void SaveCart(Cart cart)
        {
            // Store only the essential information to avoid serialization issues
            var simplifiedCart = new Cart
            {
                Items = cart.Items.Select(item => new CartItem
                {
                    // Ensure CartItemId is preserved for existing items
                    // If CartItemId is 0 (default), it will be assigned a new ID
                    CartItemId = item.CartItemId,
                    BookId = item.BookId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Book?.Price ?? item.UnitPrice
                }).ToList()
            };
            
            // Ensure each item has a unique CartItemId
            int nextId = 1;
            foreach (var item in simplifiedCart.Items)
            {
                if (item.CartItemId == 0)
                {
                    // Find the next available ID
                    while (simplifiedCart.Items.Any(i => i.CartItemId == nextId))
                    {
                        nextId++;
                    }
                    item.CartItemId = nextId++;
                }
            }
            
            var session = _httpContextAccessor.HttpContext.Session;
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            string cartJson = JsonSerializer.Serialize(simplifiedCart, options);
            session.SetString(CartSessionKey, cartJson);
        }

        [HttpGet]
        public ActionResult<Cart> GetCartItems()
        {
            var cart = GetCart();
            return cart;
        }

        [HttpPost("add/{bookId}")]
        public ActionResult<Cart> AddToCart(int bookId, int quantity = 1)
        {
            var book = _repository.Books.FirstOrDefault(b => b.BookID == bookId);
            
            if (book == null)
            {
                return NotFound("Book not found");
            }
            
            var cart = GetCart();
            
            // Log cart state before adding item
            System.Console.WriteLine($"Cart before adding item: {cart.Items.Count} items");
            foreach (var item in cart.Items)
            {
                System.Console.WriteLine($"Item: BookId={item.BookId}, CartItemId={item.CartItemId}, Quantity={item.Quantity}");
            }
            
            cart.AddItem(book, quantity);
            
            // Log cart state after adding item
            System.Console.WriteLine($"Cart after adding item: {cart.Items.Count} items");
            foreach (var item in cart.Items)
            {
                System.Console.WriteLine($"Item: BookId={item.BookId}, CartItemId={item.CartItemId}, Quantity={item.Quantity}");
            }
            
            SaveCart(cart);
            
            // Log cart state after saving
            var savedCart = GetCart();
            System.Console.WriteLine($"Cart after saving: {savedCart.Items.Count} items");
            foreach (var item in savedCart.Items)
            {
                System.Console.WriteLine($"Item: BookId={item.BookId}, CartItemId={item.CartItemId}, Quantity={item.Quantity}");
            }
            
            return cart;
        }

        [HttpPost("update/{bookId}")]
        public ActionResult<Cart> UpdateQuantity(int bookId, int quantity)
        {
            var cart = GetCart();
            cart.UpdateQuantity(bookId, quantity);
            SaveCart(cart);
            
            return cart;
        }

        [HttpDelete("remove/{bookId}")]
        public ActionResult<Cart> RemoveFromCart(int bookId)
        {
            var cart = GetCart();
            cart.RemoveItem(bookId);
            SaveCart(cart);
            
            return cart;
        }

        [HttpPost("clear")]
        public ActionResult<Cart> ClearCart()
        {
            var cart = GetCart();
            cart.Clear();
            SaveCart(cart);
            
            return cart;
        }
    }
}
