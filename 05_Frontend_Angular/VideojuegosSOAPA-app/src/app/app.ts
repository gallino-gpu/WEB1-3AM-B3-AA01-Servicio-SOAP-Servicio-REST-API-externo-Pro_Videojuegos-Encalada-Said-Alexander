import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Producto } from './model/producto.model';
import { Categoria } from './model/categoria.model';
import { JuegoExterno } from './model/juego-externo.model';

import {
  MovimientoGuardar,
  MovimientoInventario,
  MovimientoRegistro
} from './model/movimiento-inventario.model';

import { ProductoService } from './services/producto';

import {
  MovimientoInventarioService
} from './services/movimiento-inventario';

import {
  CatalogoExternoService
} from './services/catalogo-externo';

type VistaAplicacion =
  | 'inicio'
  | 'soap'
  | 'rest'
  | 'externa';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // =====================================================
  // NAVEGACIÓN
  // =====================================================

  vistaActual: VistaAplicacion = 'inicio';

  // =====================================================
  // PRODUCTOS Y CATEGORÍAS - SOAP
  // =====================================================

  productos: Producto[] = [];

  productosDisponibles: Producto[] = [];

  categorias: Categoria[] = [];

  cargando = false;
  modoEdicion = false;

  filtroCategoria = 0;

  precioMinimo: number | null = null;
  precioMaximo: number | null = null;

  productoFormulario: Producto =
    this.crearProductoVacio();

  // =====================================================
  // MOVIMIENTOS DE INVENTARIO - REST
  // =====================================================

  movimientos: MovimientoInventario[] = [];

  cargandoMovimientos = false;
  modoEdicionMovimiento = false;

  idMovimientoEdicion: number | null = null;

  movimientoFormulario: MovimientoGuardar =
    this.crearMovimientoVacio();

  // =====================================================
  // CATÁLOGO EXTERNO - CHEAPSHARK
  // =====================================================

  juegosExternos: JuegoExterno[] = [];

  busquedaExterna = '';

  cargandoExterna = false;

  errorExterna = '';

  catalogoExternoConsultado = false;

  idProductoComparacion = 0;

  dealIdComparacion = '';

  constructor(
    private productoService: ProductoService,

    private movimientoService:
      MovimientoInventarioService,

    private catalogoExternoService:
      CatalogoExternoService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
    this.cargarMovimientos();
  }

  // =====================================================
  // NAVEGACIÓN
  // =====================================================

  cambiarVista(vista: VistaAplicacion): void {
    this.vistaActual = vista;

    if (
      vista === 'externa' &&
      !this.catalogoExternoConsultado
    ) {
      this.cargarCatalogoExterno();
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  volverInicio(): void {
    this.cambiarVista('inicio');
  }

  // =====================================================
  // CATEGORÍAS Y PRODUCTOS - SERVICIO SOAP
  // =====================================================

  cargarCategorias(): void {
    this.productoService
      .obtenerCategorias()
      .subscribe({
        next: (categorias: Categoria[]) => {
          this.categorias = categorias;
        },

        error: (error: unknown) => {
          console.error(error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              'No se pudieron cargar las categorías ' +
              'desde el servicio SOAP.'
          });
        }
      });
  }

  cargarProductos(): void {
    this.cargando = true;

    this.productoService
      .obtenerProductos()
      .subscribe({
        next: (productos: Producto[]) => {
          this.productos = productos;

          this.productosDisponibles = [
            ...productos
          ];

          this.cargando = false;
        },

        error: (error: unknown) => {
          console.error(error);

          this.cargando = false;

          Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text:
              'No se pudieron cargar los productos ' +
              'desde el servicio SOAP.'
          });
        }
      });
  }

  guardarProducto(): void {
    if (!this.validarFormularioProducto()) {
      return;
    }

    if (this.modoEdicion) {
      this.actualizarProducto();
    } else {
      this.agregarProducto();
    }
  }

  agregarProducto(): void {
    const nuevoProducto: Producto = {
      ...this.productoFormulario,
      idProducto: 0,
      precio: Number(
        this.productoFormulario.precio
      ),
      stock: Number(
        this.productoFormulario.stock
      ),
      idCategoria: Number(
        this.productoFormulario.idCategoria
      )
    };

    this.productoService
      .agregarProducto(nuevoProducto)
      .subscribe({
        next: (producto: Producto | null) => {
          if (producto === null) {
            this.mostrarError(
              'No se pudo agregar el producto.'
            );
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text:
              'El producto fue guardado mediante SOAP.',
            timer: 1800,
            showConfirmButton: false
          });

          this.cancelarEdicion();
          this.cargarProductos();
        },

        error: (error: unknown) => {
          console.error(error);

          this.mostrarError(
            'Ocurrió un error al agregar el producto.'
          );
        }
      });
  }

  seleccionarProducto(
    producto: Producto
  ): void {
    this.productoFormulario = {
      ...producto
    };

    this.modoEdicion = true;

    setTimeout(() => {
      document
        .getElementById('formulario-producto')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
    });
  }

  actualizarProducto(): void {
    const productoActualizado: Producto = {
      ...this.productoFormulario,
      precio: Number(
        this.productoFormulario.precio
      ),
      stock: Number(
        this.productoFormulario.stock
      ),
      idCategoria: Number(
        this.productoFormulario.idCategoria
      )
    };

    this.productoService
      .actualizarProducto(productoActualizado)
      .subscribe({
        next: (producto: Producto | null) => {
          if (producto === null) {
            this.mostrarError(
              'El producto no fue encontrado.'
            );
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text:
              'Los cambios se guardaron mediante SOAP.',
            timer: 1800,
            showConfirmButton: false
          });

          this.cancelarEdicion();
          this.cargarProductos();
        },

        error: (error: unknown) => {
          console.error(error);

          this.mostrarError(
            'Ocurrió un error al actualizar.'
          );
        }
      });
  }

  eliminarProducto(
    producto: Producto
  ): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar producto?',
      text: `Se eliminará "${producto.nombre}".`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then(resultado => {
      if (!resultado.isConfirmed) {
        return;
      }

      this.productoService
        .eliminarProducto(producto.idProducto)
        .subscribe({
          next: (eliminado: boolean) => {
            if (!eliminado) {
              this.mostrarError(
                'El producto no pudo ser eliminado.'
              );
              return;
            }

            Swal.fire({
              icon: 'success',
              title: 'Producto eliminado',
              timer: 1600,
              showConfirmButton: false
            });

            this.cargarProductos();
          },

          error: (error: unknown) => {
            console.error(error);

            this.mostrarError(
              'No se puede eliminar un producto ' +
              'que tenga movimientos de inventario.'
            );
          }
        });
    });
  }

  filtrarPorCategoria(): void {
    if (Number(this.filtroCategoria) === 0) {
      this.cargarProductos();
      return;
    }

    this.cargando = true;

    this.productoService
      .obtenerProductosPorCategoria(
        Number(this.filtroCategoria)
      )
      .subscribe({
        next: (productos: Producto[]) => {
          this.productos = productos;
          this.cargando = false;
        },

        error: (error: unknown) => {
          console.error(error);

          this.cargando = false;

          this.mostrarError(
            'No se pudo aplicar el filtro.'
          );
        }
      });
  }

  filtrarPorPrecio(): void {
    if (
      this.precioMinimo === null ||
      this.precioMaximo === null
    ) {
      this.mostrarAdvertencia(
        'Ingresa el precio mínimo y máximo.'
      );
      return;
    }

    if (
      Number(this.precioMinimo) >
      Number(this.precioMaximo)
    ) {
      this.mostrarAdvertencia(
        'El precio mínimo no puede ser mayor al máximo.'
      );
      return;
    }

    this.cargando = true;

    this.productoService
      .obtenerProductosPorPrecio(
        Number(this.precioMinimo),
        Number(this.precioMaximo)
      )
      .subscribe({
        next: (productos: Producto[]) => {
          this.productos = productos;
          this.cargando = false;
        },

        error: (error: unknown) => {
          console.error(error);

          this.cargando = false;

          this.mostrarError(
            'No se pudo aplicar el filtro de precio.'
          );
        }
      });
  }

  limpiarFiltros(): void {
    this.filtroCategoria = 0;
    this.precioMinimo = null;
    this.precioMaximo = null;

    this.cargarProductos();
  }

  cancelarEdicion(): void {
    this.productoFormulario =
      this.crearProductoVacio();

    this.modoEdicion = false;
  }

  obtenerNombreCategoria(
    idCategoria: number
  ): string {
    const categoria = this.categorias.find(
      item =>
        item.idCategoria ===
        Number(idCategoria)
    );

    return categoria?.nombre ?? 'Sin categoría';
  }

  totalProductos(): number {
    return this.productosDisponibles.length;
  }

  totalStock(): number {
    return this.productosDisponibles.reduce(
      (total, producto) =>
        total + Number(producto.stock),
      0
    );
  }

  // =====================================================
  // MOVIMIENTOS DE INVENTARIO - SERVICIO REST
  // =====================================================

  cargarMovimientos(): void {
    this.cargandoMovimientos = true;

    this.movimientoService
      .obtenerLista()
      .subscribe({
        next: (
          movimientos: MovimientoInventario[]
        ) => {
          this.movimientos = movimientos;

          this.cargandoMovimientos = false;
        },

        error: (error: unknown) => {
          console.error(error);

          this.cargandoMovimientos = false;

          this.mostrarErrorApi(
            error,
            'No se pudieron cargar los movimientos.'
          );
        }
      });
  }

  guardarMovimiento(): void {
    if (!this.validarFormularioMovimiento()) {
      return;
    }

    if (this.modoEdicionMovimiento) {
      this.actualizarMovimiento();
    } else {
      this.registrarMovimiento();
    }
  }

  registrarMovimiento(): void {
    const datos: MovimientoRegistro = {
      idProducto: Number(
        this.movimientoFormulario.idProducto
      ),

      cantidad: Number(
        this.movimientoFormulario.cantidad
      ),

      observacion:
        this.normalizarObservacion(
          this.movimientoFormulario.observacion
        )
    };

    const tipo =
      this.movimientoFormulario.tipoMovimiento;

    const solicitud =
      tipo === 'ENTRADA'
        ? this.movimientoService
            .agregarEntrada(datos)
        : this.movimientoService
            .agregarSalida(datos);

    solicitud.subscribe({
      next: (
        movimiento: MovimientoInventario
      ) => {
        Swal.fire({
          icon: 'success',
          title:
            `${movimiento.tipoMovimiento} registrada`,
          text:
            `El stock de "${movimiento.nombreProducto}" ` +
            'se actualizó correctamente.',
          timer: 2000,
          showConfirmButton: false
        });

        this.cancelarEdicionMovimiento();
        this.actualizarDatosDeInventario();
      },

      error: (error: unknown) => {
        console.error(error);

        this.mostrarErrorApi(
          error,
          'No se pudo registrar el movimiento.'
        );
      }
    });
  }

  seleccionarMovimiento(
    movimiento: MovimientoInventario
  ): void {
    this.idMovimientoEdicion =
      movimiento.idMovimiento;

    this.movimientoFormulario = {
      idProducto: movimiento.idProducto,

      tipoMovimiento:
        movimiento.tipoMovimiento,

      cantidad: movimiento.cantidad,

      observacion:
        movimiento.observacion
    };

    this.modoEdicionMovimiento = true;

    setTimeout(() => {
      document
        .getElementById('formulario-movimiento')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
    });
  }

  actualizarMovimiento(): void {
    if (this.idMovimientoEdicion === null) {
      this.mostrarAdvertencia(
        'Selecciona un movimiento para actualizar.'
      );
      return;
    }

    const datos: MovimientoGuardar = {
      idProducto: Number(
        this.movimientoFormulario.idProducto
      ),

      tipoMovimiento:
        this.movimientoFormulario.tipoMovimiento,

      cantidad: Number(
        this.movimientoFormulario.cantidad
      ),

      observacion:
        this.normalizarObservacion(
          this.movimientoFormulario.observacion
        )
    };

    this.movimientoService
      .actualizar(
        this.idMovimientoEdicion,
        datos
      )
      .subscribe({
        next: (
          movimiento: MovimientoInventario
        ) => {
          Swal.fire({
            icon: 'success',
            title: 'Movimiento actualizado',
            text:
              `El movimiento de ` +
              `"${movimiento.nombreProducto}" ` +
              'fue actualizado correctamente.',
            timer: 2000,
            showConfirmButton: false
          });

          this.cancelarEdicionMovimiento();
          this.actualizarDatosDeInventario();
        },

        error: (error: unknown) => {
          console.error(error);

          this.mostrarErrorApi(
            error,
            'No se pudo actualizar el movimiento.'
          );
        }
      });
  }

  eliminarMovimiento(
    movimiento: MovimientoInventario
  ): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Borrar movimiento?',
      html:
        `Se eliminará el movimiento <strong>` +
        `#${movimiento.idMovimiento}</strong> de ` +
        `<strong>${movimiento.nombreProducto}</strong>.` +
        '<br><br>' +
        'El cambio realizado sobre el stock será revertido.',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then(resultado => {
      if (!resultado.isConfirmed) {
        return;
      }

      this.movimientoService
        .eliminar(movimiento.idMovimiento)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Movimiento eliminado',
              text:
                'El stock del producto fue recalculado.',
              timer: 1800,
              showConfirmButton: false
            });

            if (
              this.idMovimientoEdicion ===
              movimiento.idMovimiento
            ) {
              this.cancelarEdicionMovimiento();
            }

            this.actualizarDatosDeInventario();
          },

          error: (error: unknown) => {
            console.error(error);

            this.mostrarErrorApi(
              error,
              'No se pudo eliminar el movimiento.'
            );
          }
        });
    });
  }

  cancelarEdicionMovimiento(): void {
    this.movimientoFormulario =
      this.crearMovimientoVacio();

    this.idMovimientoEdicion = null;

    this.modoEdicionMovimiento = false;
  }

  totalEntradas(): number {
    return this.movimientos
      .filter(
        movimiento =>
          movimiento.tipoMovimiento === 'ENTRADA'
      )
      .reduce(
        (total, movimiento) =>
          total + Number(movimiento.cantidad),
        0
      );
  }

  totalSalidas(): number {
    return this.movimientos
      .filter(
        movimiento =>
          movimiento.tipoMovimiento === 'SALIDA'
      )
      .reduce(
        (total, movimiento) =>
          total + Number(movimiento.cantidad),
        0
      );
  }

  obtenerStockProductoSeleccionado():
    number | null {
    const producto =
      this.productosDisponibles.find(
        item =>
          item.idProducto ===
          Number(
            this.movimientoFormulario.idProducto
          )
      );

    return producto?.stock ?? null;
  }

  // =====================================================
  // API EXTERNA - CATÁLOGO CHEAPSHARK
  // =====================================================

  cargarCatalogoExterno(): void {
    this.cargandoExterna = true;
    this.errorExterna = '';
    this.catalogoExternoConsultado = true;

    this.catalogoExternoService
      .obtenerOfertas(this.busquedaExterna)
      .subscribe({
        next: (juegos: JuegoExterno[]) => {
          this.juegosExternos = juegos;

          this.cargandoExterna = false;

          if (juegos.length === 0) {
            this.errorExterna =
              'No se encontraron videojuegos ' +
              'con esa búsqueda.';
          }
        },

        error: (error: unknown) => {
          console.error(error);

          this.juegosExternos = [];
          this.cargandoExterna = false;

          this.errorExterna =
            'No se pudo consultar la API externa. ' +
            'Comprueba tu conexión a Internet.';
        }
      });
  }

  buscarCatalogoExterno(): void {
    this.busquedaExterna =
      this.busquedaExterna.trim();

    this.cargarCatalogoExterno();
  }

  limpiarBusquedaExterna(): void {
    this.busquedaExterna = '';
    this.cargarCatalogoExterno();
  }

  porcentajeDescuento(
    juego: JuegoExterno
  ): number {
    const ahorro = Number(juego.savings);

    if (!Number.isFinite(ahorro)) {
      return 0;
    }

    return Math.round(ahorro);
  }

  obtenerEnlaceOferta(
    juego: JuegoExterno
  ): string {
    return (
      'https://www.cheapshark.com/redirect' +
      `?dealID=${encodeURIComponent(juego.dealID)}`
    );
  }

  identificarJuego(
    indice: number,
    juego: JuegoExterno
  ): string {
    return juego.dealID || String(indice);
  }
  // =====================================================
  // COMPARACIÓN LOCAL CONTRA API EXTERNA
  // =====================================================

  obtenerProductoComparacion(): Producto | null {
    return (
      this.productosDisponibles.find(
        producto =>
          producto.idProducto ===
          Number(this.idProductoComparacion)
      ) ?? null
    );
  }

  obtenerJuegoComparacion(): JuegoExterno | null {
    return (
      this.juegosExternos.find(
        juego =>
          juego.dealID ===
          this.dealIdComparacion
      ) ?? null
    );
  }

  diferenciaPrecioComparacion(): number {
    const producto =
      this.obtenerProductoComparacion();

    const juego =
      this.obtenerJuegoComparacion();

    if (!producto || !juego) {
      return 0;
    }

    return Math.abs(
      Number(producto.precio) -
      Number(juego.salePrice)
    );
  }

  resultadoPrecioComparacion(): string {
    const producto =
      this.obtenerProductoComparacion();

    const juego =
      this.obtenerJuegoComparacion();

    if (!producto || !juego) {
      return '';
    }

    const precioLocal =
      Number(producto.precio);

    const precioExterno =
      Number(juego.salePrice);

    if (
      Math.abs(precioLocal - precioExterno) < 0.01
    ) {
      return 'Ambos tienen el mismo precio';
    }

    if (precioLocal < precioExterno) {
      return (
        'El producto local tiene el menor precio'
      );
    }

    return (
      'La oferta externa tiene el menor precio'
    );
  }

  tipoResultadoComparacion():
    'local' | 'externo' | 'igual' | '' {
    const producto =
      this.obtenerProductoComparacion();

    const juego =
      this.obtenerJuegoComparacion();

    if (!producto || !juego) {
      return '';
    }

    const precioLocal =
      Number(producto.precio);

    const precioExterno =
      Number(juego.salePrice);

    if (
      Math.abs(precioLocal - precioExterno) < 0.01
    ) {
      return 'igual';
    }

    return precioLocal < precioExterno
      ? 'local'
      : 'externo';
  }

  limpiarComparacion(): void {
    this.idProductoComparacion = 0;
    this.dealIdComparacion = '';
  }

  seleccionarJuegoComparacion(
    juego: JuegoExterno
  ): void {
    this.dealIdComparacion = juego.dealID;

    const nombreExterno =
      juego.title.toLowerCase().trim();

    const coincidencia =
      this.productosDisponibles.find(
        producto => {
          const nombreLocal =
            producto.nombre.toLowerCase().trim();

          return (
            nombreExterno.includes(nombreLocal) ||
            nombreLocal.includes(nombreExterno)
          );
        }
      );

    const productoInicial =
  coincidencia ??
  this.productosDisponibles[0];

this.idProductoComparacion =
  productoInicial?.idProducto ?? 0;

    setTimeout(() => {
      document
        .getElementById('comparador-api')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
    }, 100);
  }

  // =====================================================
  // VALIDACIONES Y MÉTODOS AUXILIARES
  // =====================================================

  private validarFormularioProducto(): boolean {
    const producto = this.productoFormulario;

    if (
      !producto.nombre.trim() ||
      !producto.descripcion.trim() ||
      Number(producto.idCategoria) === 0
    ) {
      this.mostrarAdvertencia(
        'Completa todos los campos obligatorios.'
      );

      return false;
    }

    if (
      Number(producto.precio) < 0 ||
      Number(producto.stock) < 0
    ) {
      this.mostrarAdvertencia(
        'El precio y el stock no pueden ser negativos.'
      );

      return false;
    }

    return true;
  }

  private validarFormularioMovimiento():
    boolean {
    const movimiento =
      this.movimientoFormulario;

    if (Number(movimiento.idProducto) <= 0) {
      this.mostrarAdvertencia(
        'Selecciona un producto válido.'
      );

      return false;
    }

    if (Number(movimiento.cantidad) <= 0) {
      this.mostrarAdvertencia(
        'La cantidad debe ser mayor que cero.'
      );

      return false;
    }

    if (
      movimiento.tipoMovimiento !== 'ENTRADA' &&
      movimiento.tipoMovimiento !== 'SALIDA'
    ) {
      this.mostrarAdvertencia(
        'Selecciona el tipo de movimiento.'
      );

      return false;
    }

    return true;
  }

  private crearProductoVacio(): Producto {
    return {
      idProducto: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      estado: true,
      idCategoria: 0
    };
  }

  private crearMovimientoVacio():
    MovimientoGuardar {
    return {
      idProducto: 0,
      tipoMovimiento: 'ENTRADA',
      cantidad: 1,
      observacion: ''
    };
  }

  private normalizarObservacion(
    observacion: string | null
  ): string | null {
    if (
      observacion === null ||
      observacion.trim() === ''
    ) {
      return null;
    }

    return observacion.trim();
  }

  private actualizarDatosDeInventario(): void {
    this.cargarMovimientos();
    this.cargarProductos();
  }

  private mostrarError(
    mensaje: string
  ): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    });
  }

  private mostrarAdvertencia(
    mensaje: string
  ): void {
    Swal.fire({
      icon: 'warning',
      title: 'Revisa los datos',
      text: mensaje
    });
  }

  private mostrarErrorApi(
    error: any,
    mensajePredeterminado: string
  ): void {
    const mensaje =
      error?.error?.mensaje ??
      error?.error?.title ??
      mensajePredeterminado;

    Swal.fire({
      icon: 'error',
      title: 'No se pudo completar la operación',
      text: mensaje
    });
  }
}
