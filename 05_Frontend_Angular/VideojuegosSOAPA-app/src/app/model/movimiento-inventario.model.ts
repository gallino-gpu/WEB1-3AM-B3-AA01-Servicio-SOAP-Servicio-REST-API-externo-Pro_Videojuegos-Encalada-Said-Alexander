export type TipoMovimiento = 'ENTRADA' | 'SALIDA';

export interface MovimientoInventario {
  idMovimiento: number;
  idProducto: number;
  nombreProducto: string;
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  fechaMovimiento: string;
  observacion: string | null;
}

export interface MovimientoRegistro {
  idProducto: number;
  cantidad: number;
  observacion: string | null;
}

export interface MovimientoGuardar extends MovimientoRegistro {
  tipoMovimiento: TipoMovimiento;
}