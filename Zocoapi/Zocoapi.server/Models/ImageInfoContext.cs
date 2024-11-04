using Microsoft.EntityFrameworkCore;

namespace Zocoapi.server.Models
{

    public class ImageInfoContext : DbContext
    {
        public ImageInfoContext(DbContextOptions<ImageInfoContext> options) : base(options)
        {
        }

        public DbSet<ImageInfo> ImageInfo{ get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<JobInfo>().HasIndex(c => c.).IsUnique();

            // Puedes agregar configuraciones adicionales aquí
        }
    }
}
