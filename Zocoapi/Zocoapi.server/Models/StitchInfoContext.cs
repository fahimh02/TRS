using Microsoft.EntityFrameworkCore;
using Product.Server.Models;

namespace Zocoapi.server.Models
{
    public class StitchInfoContext : DbContext
    {
        public StitchInfoContext(DbContextOptions<StitchInfoContext> options) : base(options)
        {
        }

        public DbSet<StitchInfo> StitchInfos { get; set; }
        public DbSet<User> User { get; set; } // Asegúrate de agregar esta línea

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<StitchInfo>().HasIndex(c => c.StitchName).IsUnique();

            // Puedes agregar configuraciones adicionales aquí
        }
    }
}
