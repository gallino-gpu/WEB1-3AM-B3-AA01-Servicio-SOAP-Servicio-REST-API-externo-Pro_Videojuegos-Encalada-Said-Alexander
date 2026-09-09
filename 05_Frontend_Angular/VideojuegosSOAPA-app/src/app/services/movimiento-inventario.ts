import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  MovimientoGuardar,
  MovimientoInventario,
  MovimientoRegistro
} from '../model/movimiento-inventario.model';

@Injectable({
  providedIn: 'root'
})
export class MovimientoInventarioService {

  private readonly apiUrl =
    'http://localhost:5182/api/MovimientosInventario';

  constructor(private http: HttpClient) {}

  obtenerLista(): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(
      this.apiUrl
    );
  }

  obtenerPorId(id: number): Observable<MovimientoInventario> {
    return this.http.get<MovimientoInventario>(
      `${this.apiUrl}/${id}`
    );
  }

  agregarEntrada(
    datos: MovimientoRegistro
  ): Observable<MovimientoInventario> {
    return this.http.post<MovimientoInventario>(
      `${this.apiUrl}/entrada`,
      datos
    );
  }

  agregarSalida(
    datos: MovimientoRegistro
  ): Observable<MovimientoInventario> {
    return this.http.post<MovimientoInventario>(
      `${this.apiUrl}/salida`,
      datos
    );
  }

  guardar(
    datos: MovimientoGuardar
  ): Observable<MovimientoInventario> {
    return this.http.post<MovimientoInventario>(
      this.apiUrl,
      datos
    );
  }

  actualizar(
    id: number,
    datos: MovimientoGuardar
  ): Observable<MovimientoInventario> {
    return this.http.put<MovimientoInventario>(
      `${this.apiUrl}/${id}`,
      datos
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}