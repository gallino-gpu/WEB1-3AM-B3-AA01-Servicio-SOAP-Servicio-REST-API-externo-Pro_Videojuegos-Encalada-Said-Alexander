using Microsoft.EntityFrameworkCore;
using VideojuegosREST.Models;

namespace VideojuegosREST.Data
{
    public class VideojuegosDbContext : DbContext
    {
        public VideojuegosDbContext(
            DbContextOptions<VideojuegosDbContext> options
        ) : base(options)
        {
        }

        public DbSet<Producto> Productos => Set<Producto>();

        public DbSet<MovimientoInventario> MovimientosInventario
            => Set<MovimientoInventario>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MovimientoInventario>()
                .HasOne(m => m.Producto)
                .WithMany()
                .HasForeignKey(m => m.IdProducto)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<MovimientoInventario>()
                .Property(m => m.FechaMovimiento)
                .HasDefaultValueSql("SYSDATETIME()");
        }
    }
}