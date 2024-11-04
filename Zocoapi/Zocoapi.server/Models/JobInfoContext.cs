using Microsoft.EntityFrameworkCore;
using Product.Server.Models;

namespace Zocoapi.server.Models
{
    public class JobInfoContext : DbContext
    {
        public JobInfoContext(DbContextOptions<JobInfoContext> options) : base(options)
        {
        }

        public DbSet<JobInfo> JobInfo { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<JobInfo>().HasIndex(c => c.).IsUnique();

            // Puedes agregar configuraciones adicionales aquí
        }
    }
}
