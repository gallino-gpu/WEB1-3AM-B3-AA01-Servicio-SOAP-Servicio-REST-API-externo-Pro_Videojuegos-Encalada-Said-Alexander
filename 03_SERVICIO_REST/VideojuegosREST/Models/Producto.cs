using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VideojuegosREST.Models
{
    [Table("Productos", Schema = "dbo")]
    public class Producto
    {
        [Key]
        public int IdProducto { get; set; }

        [Required]
        [MaxLength(150)]
        [Column(TypeName = "varchar(150)")]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(300)]
        [Column(TypeName = "varchar(300)")]
        public string? Descripcion { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Precio { get; set; }

        [ConcurrencyCheck]
        public int Stock { get; set; }

        public bool Estado { get; set; }

        public int IdCategoria { get; set; }
    }
}