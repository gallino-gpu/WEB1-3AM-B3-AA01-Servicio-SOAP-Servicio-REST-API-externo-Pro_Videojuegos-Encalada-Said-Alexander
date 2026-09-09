using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VideojuegosREST.Models
{
    [Table("Movimiento_Inventario", Schema = "dbo")]
    public class MovimientoInventario
    {
        [Key]
        public int IdMovimiento { get; set; }

        public int IdProducto { get; set; }

        [Required]
        [MaxLength(10)]
        [Column(TypeName = "varchar(10)")]
        public string TipoMovimiento { get; set; } = string.Empty;

        [Range(1, int.MaxValue,
            ErrorMessage = "La cantidad debe ser mayor que cero.")]
        public int Cantidad { get; set; }

        [Column(TypeName = "datetime2(0)")]
        public DateTime FechaMovimiento { get; set; }

        [MaxLength(500)]
        [Column(TypeName = "varchar(500)")]
        public string? Observacion { get; set; }

        public Producto? Producto { get; set; }
    }
}