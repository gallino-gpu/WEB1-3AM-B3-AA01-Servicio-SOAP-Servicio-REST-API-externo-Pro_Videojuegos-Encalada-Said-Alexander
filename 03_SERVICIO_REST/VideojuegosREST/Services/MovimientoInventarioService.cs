using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using VideojuegosREST.Data;
using VideojuegosREST.DTOs;
using VideojuegosREST.Models;

namespace VideojuegosREST.Services
{
    public class MovimientoInventarioService
    {
        private readonly VideojuegosDbContext _context;

        public MovimientoInventarioService(
            VideojuegosDbContext context)
        {
            _context = context;
        }

        // Crear un movimiento y aplicar su efecto al stock.
        public async Task<MovimientoRespuestaDto> RegistrarAsync(
            MovimientoRegistroDto datos,
            string tipoMovimiento,
            CancellationToken cancellationToken)
        {
            ValidarDatos(datos, tipoMovimiento);

            var producto = await _context.Productos
                .SingleOrDefaultAsync(
                    p => p.IdProducto == datos.IdProducto,
                    cancellationToken);

            if (producto == null)
            {
                throw new KeyNotFoundException(
                    "El producto seleccionado no existe.");
            }

            if (!producto.Estado)
            {
                throw new ValidationException(
                    "No se pueden registrar movimientos de un producto inactivo.");
            }

            long nuevoStock = (long)producto.Stock
                + ObtenerEfecto(tipoMovimiento, datos.Cantidad);

            int stockValidado = ValidarStock(
                nuevoStock,
                producto.Nombre);

            var movimiento = new MovimientoInventario
            {
                IdProducto = producto.IdProducto,
                TipoMovimiento = tipoMovimiento,
                Cantidad = datos.Cantidad,
                Observacion = NormalizarObservacion(datos.Observacion)
            };

            // La fecha se genera en SQL Server.
            producto.Stock = stockValidado;

            _context.MovimientosInventario.Add(movimiento);

            await _context.SaveChangesAsync(cancellationToken);

            return CrearRespuesta(movimiento, producto);
        }

        // Actualizar un movimiento existente y corregir su efecto.
        public async Task<MovimientoRespuestaDto> ActualizarAsync(
            int id,
            MovimientoGuardarDto datos,
            CancellationToken cancellationToken)
        {
            if (id <= 0)
            {
                throw new ValidationException(
                    "El ID debe ser mayor que cero.");
            }

            ValidarDatos(datos, datos.TipoMovimiento);

            try
            {
                // Mantiene consistentes las lecturas y escrituras
                // mientras se calcula y guarda el ajuste.
                await using var transaccion =
                    await _context.Database.BeginTransactionAsync(
                        IsolationLevel.Serializable,
                        cancellationToken);

                var movimiento = await _context.MovimientosInventario
                    .Include(m => m.Producto)
                    .SingleOrDefaultAsync(
                        m => m.IdMovimiento == id,
                        cancellationToken);

                if (movimiento == null)
                {
                    throw new KeyNotFoundException(
                        "El movimiento que deseas actualizar no existe.");
                }

                var productoAnterior = movimiento.Producto;

                if (productoAnterior == null)
                {
                    throw new KeyNotFoundException(
                        "No se encontró el producto del movimiento original.");
                }

                Producto productoNuevo;

                if (datos.IdProducto == productoAnterior.IdProducto)
                {
                    productoNuevo = productoAnterior;
                }
                else
                {
                    var encontrado = await _context.Productos
                        .SingleOrDefaultAsync(
                            p => p.IdProducto == datos.IdProducto,
                            cancellationToken);

                    if (encontrado == null)
                    {
                        throw new KeyNotFoundException(
                            "El nuevo producto seleccionado no existe.");
                    }

                    productoNuevo = encontrado;
                }

                if (!productoNuevo.Estado)
                {
                    throw new ValidationException(
                        "El producto seleccionado está inactivo.");
                }

                long efectoAnterior = ObtenerEfecto(
                    movimiento.TipoMovimiento,
                    movimiento.Cantidad);

                long efectoNuevo = ObtenerEfecto(
                    datos.TipoMovimiento,
                    datos.Cantidad);

                if (productoAnterior.IdProducto ==
                    productoNuevo.IdProducto)
                {
                    // Quita el efecto anterior y aplica el nuevo.
                    long stockFinal = (long)productoAnterior.Stock
                        - efectoAnterior
                        + efectoNuevo;

                    productoAnterior.Stock = ValidarStock(
                        stockFinal,
                        productoAnterior.Nombre);
                }
                else
                {
                    // Si cambia el producto, corrige ambos stocks.
                    long stockAnterior = (long)productoAnterior.Stock
                        - efectoAnterior;

                    long stockNuevo = (long)productoNuevo.Stock
                        + efectoNuevo;

                    int anteriorValidado = ValidarStock(
                        stockAnterior,
                        productoAnterior.Nombre);

                    int nuevoValidado = ValidarStock(
                        stockNuevo,
                        productoNuevo.Nombre);

                    productoAnterior.Stock = anteriorValidado;
                    productoNuevo.Stock = nuevoValidado;
                }

                movimiento.IdProducto = productoNuevo.IdProducto;
                movimiento.Producto = productoNuevo;
                movimiento.TipoMovimiento = datos.TipoMovimiento;
                movimiento.Cantidad = datos.Cantidad;
                movimiento.Observacion =
                    NormalizarObservacion(datos.Observacion);

                // Se conservan IdMovimiento y FechaMovimiento.
                await _context.SaveChangesAsync(cancellationToken);

                await transaccion.CommitAsync(cancellationToken);

                return CrearRespuesta(movimiento, productoNuevo);
            }
            catch (Exception ex) when (
                ex.GetBaseException() is SqlException sql &&
                sql.Number == 1205)
            {
                // SQL Server revierte la transacción elegida
                // como víctima de un bloqueo mutuo.
                throw new DbUpdateConcurrencyException(
                    "Hubo un conflicto con otra operación. " +
                    "Consulta el movimiento antes de volver a intentarlo.",
                    ex);
            }
        }
        // Eliminar un movimiento y revertir su efecto sobre el stock.
        public async Task EliminarAsync(
            int id,
            CancellationToken cancellationToken)
        {
            if (id <= 0)
            {
                throw new ValidationException(
                    "El ID debe ser mayor que cero.");
            }

            try
            {
                await using var transaccion =
                    await _context.Database.BeginTransactionAsync(
                        IsolationLevel.Serializable,
                        cancellationToken);

                var movimiento = await _context.MovimientosInventario
                    .Include(m => m.Producto)
                    .SingleOrDefaultAsync(
                        m => m.IdMovimiento == id,
                        cancellationToken);

                if (movimiento == null)
                {
                    throw new KeyNotFoundException(
                        "El movimiento que deseas eliminar no existe.");
                }

                var producto = movimiento.Producto;

                if (producto == null)
                {
                    throw new KeyNotFoundException(
                        "No se encontró el producto del movimiento.");
                }

                long efectoOriginal = ObtenerEfecto(
                    movimiento.TipoMovimiento,
                    movimiento.Cantidad);

                // Eliminar una ENTRADA resta sus unidades.
                // Eliminar una SALIDA devuelve sus unidades.
                long stockFinal = (long)producto.Stock - efectoOriginal;

                producto.Stock = ValidarStock(
                    stockFinal,
                    producto.Nombre);

                // Solo se elimina el movimiento, no el producto.
                _context.MovimientosInventario.Remove(movimiento);

                await _context.SaveChangesAsync(cancellationToken);

                await transaccion.CommitAsync(cancellationToken);
            }
            catch (Exception ex) when (
                ex.GetBaseException() is SqlException sql &&
                sql.Number == 1205)
            {
                throw new DbUpdateConcurrencyException(
                    "Hubo un conflicto con otra operación. " +
                    "Consulta el movimiento antes de volver a intentarlo.",
                    ex);
            }
        }
        private static void ValidarDatos(
            MovimientoRegistroDto datos,
            string tipoMovimiento)
        {
            Validator.ValidateObject(
                datos,
                new ValidationContext(datos),
                validateAllProperties: true);

            if (tipoMovimiento != "ENTRADA" &&
                tipoMovimiento != "SALIDA")
            {
                throw new ValidationException(
                    "El tipo de movimiento debe ser ENTRADA o SALIDA.");
            }
        }

        private static long ObtenerEfecto(
            string tipoMovimiento,
            int cantidad)
        {
            return tipoMovimiento switch
            {
                "ENTRADA" => (long)cantidad,
                "SALIDA" => -(long)cantidad,
                _ => throw new ValidationException(
                    "El movimiento contiene un tipo no válido.")
            };
        }

        private static int ValidarStock(
            long stock,
            string nombreProducto)
        {
            if (stock < 0)
            {
                throw new ValidationException(
                    $"Stock insuficiente para '{nombreProducto}'. " +
                    "La operación dejaría el stock negativo.");
            }

            if (stock > int.MaxValue)
            {
                throw new ValidationException(
                    $"La operación supera el límite de stock de " +
                    $"'{nombreProducto}'.");
            }

            return (int)stock;
        }

        private static string? NormalizarObservacion(
            string? observacion)
        {
            return string.IsNullOrWhiteSpace(observacion)
                ? null
                : observacion.Trim();
        }

        private static MovimientoRespuestaDto CrearRespuesta(
            MovimientoInventario movimiento,
            Producto producto)
        {
            return new MovimientoRespuestaDto
            {
                IdMovimiento = movimiento.IdMovimiento,
                IdProducto = producto.IdProducto,
                NombreProducto = producto.Nombre,
                TipoMovimiento = movimiento.TipoMovimiento,
                Cantidad = movimiento.Cantidad,
                FechaMovimiento = movimiento.FechaMovimiento,
                Observacion = movimiento.Observacion
            };
        }
    }
}