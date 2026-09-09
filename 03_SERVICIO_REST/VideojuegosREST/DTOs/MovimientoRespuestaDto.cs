using System;

namespace VideojuegosREST.DTOs
{
    public class MovimientoRespuestaDto
    {
        public int IdMovimiento { get; set; }

        public int IdProducto { get; set; }

        public string NombreProducto { get; set; } = string.Empty;

        public string TipoMovimiento { get; set; } = string.Empty;

        public int Cantidad { get; set; }

        public DateTime FechaMovimiento { get; set; }

        public string? Observacion { get; set; }
    }
}