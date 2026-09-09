using CoreWCF;
using VideojuegosSOAP.Data;
using VideojuegosSOAP.Models;

namespace VideojuegosSOAP.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
    public class ProductoService : IProductoService
    {
        private readonly VideojuegosDBContext _context;

        public ProductoService(VideojuegosDBContext context)
        {
            _context = context;
        }

        public List<Categoria> ObtenerCategorias()
        {
            return _context.Categorias.ToList();
        }

        public List<Producto> ObtenerProductos()
        {
            return _context.Productos.ToList();
        }

        public Producto? ObtenerProducto(int id)
        {
            var producto = _context.Productos
                .FirstOrDefault(p => p.IdProducto == id);

            if (producto == null)
            {
                return null;
            }

            return producto;
        }

        public Producto AgregarProducto(Producto producto)
        {
            _context.Productos.Add(producto);
            _context.SaveChanges();

            return producto;
        }

        public Producto? ActualizarProducto(Producto producto)
        {
            var productoExistente = _context.Productos
                .Find(producto.IdProducto);

            if (productoExistente == null)
            {
                return null;
            }

            productoExistente.Nombre = producto.Nombre;
            productoExistente.Descripcion = producto.Descripcion;
            productoExistente.Precio = producto.Precio;
            productoExistente.Stock = producto.Stock;
            productoExistente.Estado = producto.Estado;
            productoExistente.IdCategoria = producto.IdCategoria;

            _context.SaveChanges();

            return productoExistente;
        }

        public bool EliminarProducto(int id)
        {
            var producto = _context.Productos.Find(id);

            if (producto == null)
            {
                return false;
            }

            _context.Productos.Remove(producto);
            _context.SaveChanges();

            return true;
        }

        public List<Producto> ObtenerProductosPorPrecio(
            decimal precioMinimo,
            decimal precioMaximo)
        {
            return _context.Productos
                .Where(p =>
                    p.Precio >= precioMinimo &&
                    p.Precio <= precioMaximo)
                .ToList();
        }

        public List<Producto> ObtenerProductosPorCategoria(int idCategoria)
        {
            return _context.Productos
                .Where(p => p.IdCategoria == idCategoria)
                .ToList();
        }
    }
}