using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideojuegosREST.Data;
using VideojuegosREST.DTOs;
using VideojuegosREST.Services;

namespace VideojuegosREST.Controllers
{
    [ApiController]
    [Route("api/MovimientosInventario")]
    public class MovimientosInventarioController : ControllerBase
    {
        private readonly VideojuegosDbContext _context;
        private readonly MovimientoInventarioService _service;

        public MovimientosInventarioController(
            VideojuegosDbContext context,
            MovimientoInventarioService service)
        {
            _context = context;
            _service = service;
        }

        // GET: api/MovimientosInventario
        [HttpGet]
        public async Task<ActionResult<List<MovimientoRespuestaDto>>>
            ObtenerLista(CancellationToken cancellationToken)
        {
            var movimientos = await ConsultarMovimientos()
                .OrderByDescending(m => m.FechaMovimiento)
                .ThenByDescending(m => m.IdMovimiento)
                .ToListAsync(cancellationToken);

            return Ok(movimientos);
        }

        // GET: api/MovimientosInventario/3
        [HttpGet("{id:int}")]
        public async Task<ActionResult<MovimientoRespuestaDto>>
            ObtenerUno(
                int id,
                CancellationToken cancellationToken)
        {
            if (id <= 0)
            {
                return BadRequest(new
                {
                    mensaje = "El ID debe ser mayor que cero."
                });
            }

            var movimiento = await ConsultarMovimientos()
                .FirstOrDefaultAsync(
                    m => m.IdMovimiento == id,
                    cancellationToken);

            if (movimiento == null)
            {
                return NotFound(new
                {
                    mensaje = "El movimiento no existe."
                });
            }

            return Ok(movimiento);
        }

        // POST: api/MovimientosInventario/entrada
        [HttpPost("entrada")]
        public Task<ActionResult<MovimientoRespuestaDto>>
            RegistrarEntrada(
                [FromBody] MovimientoRegistroDto datos,
                CancellationToken cancellationToken)
        {
            return EjecutarOperacion(
                () => _service.RegistrarAsync(
                    datos,
                    "ENTRADA",
                    cancellationToken),
                crear: true);
        }

        // POST: api/MovimientosInventario/salida
        [HttpPost("salida")]
        public Task<ActionResult<MovimientoRespuestaDto>>
            RegistrarSalida(
                [FromBody] MovimientoRegistroDto datos,
                CancellationToken cancellationToken)
        {
            return EjecutarOperacion(
                () => _service.RegistrarAsync(
                    datos,
                    "SALIDA",
                    cancellationToken),
                crear: true);
        }

        // POST: api/MovimientosInventario
        [HttpPost]
        public Task<ActionResult<MovimientoRespuestaDto>>
            GuardarRegistro(
                [FromBody] MovimientoGuardarDto datos,
                CancellationToken cancellationToken)
        {
            return EjecutarOperacion(
                () => _service.RegistrarAsync(
                    datos,
                    datos.TipoMovimiento,
                    cancellationToken),
                crear: true);
        }

        // PUT: api/MovimientosInventario/3
        [HttpPut("{id:int}")]
        public Task<ActionResult<MovimientoRespuestaDto>>
            ActualizarRegistro(
                int id,
                [FromBody] MovimientoGuardarDto datos,
                CancellationToken cancellationToken)
        {
            return EjecutarOperacion(
                () => _service.ActualizarAsync(
                    id,
                    datos,
                    cancellationToken),
                crear: false);
        }

        // DELETE: api/MovimientosInventario/3
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> EliminarRegistro(
            int id,
            CancellationToken cancellationToken)
        {
            try
            {
                await _service.EliminarAsync(
                    id,
                    cancellationToken);

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    mensaje = ex.Message
                });
            }
            catch (ValidationException ex)
            {
                return BadRequest(new
                {
                    mensaje = ex.Message
                });
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new
                {
                    mensaje =
                        "Hubo un conflicto con otra operación. " +
                        "Consulta el movimiento y el stock " +
                        "antes de volver a intentarlo."
                });
            }
        }
        // Manejo compartido de respuestas y errores.
        private async Task<ActionResult<MovimientoRespuestaDto>>
            EjecutarOperacion(
                Func<Task<MovimientoRespuestaDto>> operacion,
                bool crear)
        {
            try
            {
                var resultado = await operacion();

                if (crear)
                {
                    return CreatedAtAction(
                        nameof(ObtenerUno),
                        new { id = resultado.IdMovimiento },
                        resultado);
                }

                return Ok(resultado);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    mensaje = ex.Message
                });
            }
            catch (ValidationException ex)
            {
                return BadRequest(new
                {
                    mensaje = ex.Message
                });
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new
                {
                    mensaje =
                        "Hubo un conflicto con otra operación. " +
                        "Consulta el movimiento y el stock " +
                        "antes de volver a intentarlo."
                });
            }
        }

        private IQueryable<MovimientoRespuestaDto>
            ConsultarMovimientos()
        {
            return _context.MovimientosInventario
                .AsNoTracking()
                .Select(m => new MovimientoRespuestaDto
                {
                    IdMovimiento = m.IdMovimiento,
                    IdProducto = m.IdProducto,
                    NombreProducto = m.Producto != null
                        ? m.Producto.Nombre
                        : string.Empty,
                    TipoMovimiento = m.TipoMovimiento,
                    Cantidad = m.Cantidad,
                    FechaMovimiento = m.FechaMovimiento,
                    Observacion = m.Observacion
                });
        }
    }
}