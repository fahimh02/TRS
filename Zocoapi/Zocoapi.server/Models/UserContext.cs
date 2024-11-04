using Microsoft.EntityFrameworkCore;

namespace Product.Server.Models
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options)
        {
        }

        public DbSet<User> User { get; set; } // Nombre pluralizado para convención

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Aquí puedes añadir configuraciones adicionales, como índices únicos u otras restricciones
        }
    }
}
