import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  JuegoExterno
} from '../model/juego-externo.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogoExternoService {

  private readonly apiUrl =
    'https://www.cheapshark.com/api/1.0/deals';

  constructor(
    private http: HttpClient
  ) {}

  obtenerOfertas(
    busqueda: string = ''
  ): Observable<JuegoExterno[]> {
    let parametros = new HttpParams()
      .set('storeID', '1')
      .set('pageNumber', '0')
      .set('pageSize', '12')
      .set('sortBy', 'Deal Rating');

    const texto = busqueda.trim();

    if (texto !== '') {
      parametros = parametros.set('title', texto);
    }

    return this.http.get<JuegoExterno[]>(
      this.apiUrl,
      {
        params: parametros
      }
    );
  }
}