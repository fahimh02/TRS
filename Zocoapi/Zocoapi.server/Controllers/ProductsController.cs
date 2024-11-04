using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Product.Server.Models;

namespace Zocoapi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductContext _context;

        public ProductsController(ProductContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product.Server.Models.Product>>> GetProducts()
        {
            var products = await _context.Products
                                        .Select(p => new Product.Server.Models.Product
                                        {
                                            Id = p.Id,
                                            Name = p.Name,
                                            Description = p.Description,
                                            Price = p.Price,
                                            CategoryId = p.CategoryId
                                        })
                                        .ToListAsync();

            return products;
        }


        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product.Server.Models.Product>> GetProduct(int id)
        {
            var product = await _context.Products
                                        .Include(p => p.CategoryId) // Incluir la categoría relacionada
                                        .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }


        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<Product.Server.Models.Product>> PostProduct(Product.Server.Models.Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product.Server.Models.Product product)
        {
            var username = User.Identity.Name;

            var user = await _context.User.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null || user.Role != "admin")
            {
                return Forbid(); 
            }

            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var username = User.Identity.Name;

            var user = await _context.User.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null || user.Role != "admin")
            {
                return Forbid();
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
