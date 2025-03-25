using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using BookstoreApp.Models;
using System.Text.Json;
using System.Linq;

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
            
            return JsonSerializer.Deserialize<Cart>(cartJson);
        }

        private void SaveCart(Cart cart)
        {
            var session = _httpContextAccessor.HttpContext.Session;
            string cartJson = JsonSerializer.Serialize(cart);
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
            cart.AddItem(book, quantity);
            SaveCart(cart);
            
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
