using Microsoft.EntityFrameworkCore;
using VideojuegosSOAP.Models;

namespace VideojuegosSOAP.Data
{
    public class VideojuegosDBContext : DbContext
    {
        public VideojuegosDBContext(
            DbContextOptions<VideojuegosDBContext> options)
            : base(options)
        {
        }

        public DbSet<Categoria> Categorias { get; set; }

        public DbSet<Producto> Productos { get; set; }
    }
}