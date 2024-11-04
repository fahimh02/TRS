using Microsoft.EntityFrameworkCore;
using Product.Server.Models;

namespace Zocoapi.server.Models
{
  
    public class UnitContext : DbContext
    {
        public UnitContext(DbContextOptions<UnitContext> options) : base(options)
        {
        }

        public DbSet<Unit> Units { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ArticleInfo>().HasIndex(c => c.Name).IsUnique();
        }
    }
}
