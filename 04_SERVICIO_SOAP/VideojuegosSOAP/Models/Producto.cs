using System.ComponentModel.DataAnnotations;

namespace VideojuegosSOAP.Models
{
    public class Producto
    {
        [Key]
        public int IdProducto { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public decimal Precio { get; set; }

        public int Stock { get; set; }

        public bool Estado { get; set; }

        public int IdCategoria { get; set; }
    }
}