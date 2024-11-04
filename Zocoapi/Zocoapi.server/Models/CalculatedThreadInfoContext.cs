using Microsoft.EntityFrameworkCore;

namespace Zocoapi.server.Models
{

    public class CalculatedThreadInfoContext : DbContext
    {
        public CalculatedThreadInfoContext(DbContextOptions<CalculatedThreadInfoContext> options) : base(options)
        {
        }

        public DbSet<CalculatedThreadInfo> CalculatedThreadInfo { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //modelBuilder.Entity<CalculatedThreadInfo>().HasIndex(c => c.Name).IsUnique();
        }
    }
}
