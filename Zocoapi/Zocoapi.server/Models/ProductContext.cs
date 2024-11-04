using Microsoft.EntityFrameworkCore;
using Product.Server.Models;

namespace Product.Server.Models
{
    public class ProductContext : DbContext
    {
        public ProductContext(DbContextOptions<ProductContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> User { get; set; } // Asegúrate de agregar esta línea

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>().HasIndex(c => c.Name).IsUnique();

            // Puedes agregar configuraciones adicionales aquí
        }
    }
}
