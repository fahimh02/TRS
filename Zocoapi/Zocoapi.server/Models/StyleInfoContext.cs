using Microsoft.EntityFrameworkCore;
using Product.Server.Models;

namespace Zocoapi.server.Models
{

    public class StyleInfoContext : DbContext
    {
        public StyleInfoContext(DbContextOptions<StyleInfoContext> options) : base(options)
        {
        }

        public DbSet<StyleInfo> StyleInfo { get; set; }
        public DbSet<User> User { get; set; } // Asegúrate de agregar esta línea

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<StyleInfo>().HasIndex(c => c.StyleCode).IsUnique();

            // Puedes agregar configuraciones adicionales aquí
        }
    }
}
