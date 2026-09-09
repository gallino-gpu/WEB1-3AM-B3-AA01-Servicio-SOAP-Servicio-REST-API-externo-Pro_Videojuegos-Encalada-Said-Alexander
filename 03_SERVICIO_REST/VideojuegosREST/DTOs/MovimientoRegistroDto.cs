using System.ComponentModel.DataAnnotations;

namespace VideojuegosREST.DTOs
{
    public class MovimientoRegistroDto
    {
        [Range(1, int.MaxValue,
            ErrorMessage = "Debes seleccionar un producto válido.")]
        public int IdProducto { get; set; }

        [Range(1, int.MaxValue,
            ErrorMessage = "La cantidad debe ser mayor que cero.")]
        public int Cantidad { get; set; }

        [MaxLength(500,
            ErrorMessage = "La observación no puede superar 500 caracteres.")]
        public string? Observacion { get; set; }
    }
}