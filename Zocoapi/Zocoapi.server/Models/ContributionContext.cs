using Microsoft.EntityFrameworkCore;
using Product.Server.Models;

namespace Zocoapi.server.Models
{
    public class ContributionContext : DbContext
    {
        public ContributionContext(DbContextOptions<ContributionContext> options) : base(options)
        {
        }

        public DbSet<Contribution> Contributions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Category>().HasIndex(c => c.Name).IsUnique();
        }
    }
}
