using System.ComponentModel.DataAnnotations;

namespace VideojuegosREST.DTOs
{
    public class MovimientoGuardarDto : MovimientoRegistroDto
    {
        [Required(ErrorMessage = "El tipo de movimiento es obligatorio.")]
        [RegularExpression(
            "^(ENTRADA|SALIDA)$",
            ErrorMessage = "El tipo de movimiento debe ser ENTRADA o SALIDA.")]
        public string TipoMovimiento { get; set; } = string.Empty;
    }
}