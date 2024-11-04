using Microsoft.EntityFrameworkCore;
using Product.Server.Models;

namespace Zocoapi.server.Models
{
  
    public class ArticleInfoContext : DbContext
    {
        public ArticleInfoContext(DbContextOptions<ArticleInfoContext> options) : base(options)
        {
        }

        public DbSet<ArticleInfo> ArticleInfo { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ArticleInfo>().HasIndex(c => c.Name).IsUnique();
        }
    }
}
