import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Producto } from '../model/producto.model';
import { Categoria } from '../model/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly url =
    'http://localhost:5171/ProductoService.svc';

  constructor(private http: HttpClient) {}

  private crearHeaders(accion: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'text/xml;charset=utf-8',
      'SOAPAction':
        `"http://tempuri.org/IProductoService/${accion}"`
    });
  }

  obtenerCategorias(): Observable<Categoria[]> {
    const xml = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:ObtenerCategorias/>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders('ObtenerCategorias'),
        responseType: 'text'
      }
    ).pipe(
      map(respuesta => this.convertirCategorias(respuesta))
    );
  }

  obtenerProductos(): Observable<Producto[]> {
    const xml = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:ObtenerProductos/>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders('ObtenerProductos'),
        responseType: 'text'
      }
    ).pipe(
      map(respuesta => this.convertirProductos(respuesta))
    );
  }

  obtenerProducto(id: number): Observable<Producto | null> {
    const xml = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:ObtenerProducto>
            <tem:id>${id}</tem:id>
          </tem:ObtenerProducto>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders('ObtenerProducto'),
        responseType: 'text'
      }
    ).pipe(
      map(respuesta => this.convertirUnProducto(respuesta))
    );
  }

  agregarProducto(producto: Producto): Observable<Producto | null> {
    const xml = this.crearXmlProducto(
      'AgregarProducto',
      producto
    );

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders('AgregarProducto'),
        responseType: 'text'
      }
    ).pipe(
      map(respuesta => this.convertirUnProducto(respuesta))
    );
  }

  actualizarProducto(
    producto: Producto
  ): Observable<Producto | null> {
    const xml = this.crearXmlProducto(
      'ActualizarProducto',
      producto
    );

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders('ActualizarProducto'),
        responseType: 'text'
      }
    ).pipe(
      map(respuesta => this.convertirUnProducto(respuesta))
    );
  }

  eliminarProducto(id: number): Observable<boolean> {
    const xml = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:EliminarProducto>
            <tem:id>${id}</tem:id>
          </tem:EliminarProducto>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders('EliminarProducto'),
        responseType: 'text'
      }
    ).pipe(
      map(respuesta =>
        this.obtenerBooleano(
          respuesta,
          'EliminarProductoResult'
        )
      )
    );
  }

  obtenerProductosPorPrecio(
    precioMinimo: number,
    precioMaximo: number
  ): Observable<Producto[]> {
    const xml = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:ObtenerProductosPorPrecio>
            <tem:precioMinimo>${precioMinimo}</tem:precioMinimo>
            <tem:precioMaximo>${precioMaximo}</tem:precioMaximo>
          </tem:ObtenerProductosPorPrecio>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url,
      xml,
      {
        headers:
          this.crearHeaders('ObtenerProductosPorPrecio'),
        responseType: 'text'
      }
    ).pipe(
      map(respuesta => this.convertirProductos(respuesta))
    );
  }

  obtenerProductosPorCategoria(
    idCategoria: number
  ): Observable<Producto[]> {
    const xml = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:ObtenerProductosPorCategoria>
            <tem:idCategoria>${idCategoria}</tem:idCategoria>
          </tem:ObtenerProductosPorCategoria>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url,
      xml,
      {
        headers:
          this.crearHeaders('ObtenerProductosPorCategoria'),
        responseType: 'text'
      }
    ).pipe(
      map(respuesta => this.convertirProductos(respuesta))
    );
  }

  private crearXmlProducto(
    accion: string,
    producto: Producto
  ): string {
    return `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/"
        xmlns:pro="http://schemas.datacontract.org/2004/07/VideojuegosSOAP.Models">
        <soap:Header/>
        <soap:Body>
          <tem:${accion}>
            <tem:producto>
              <pro:Descripcion>${this.escaparXml(producto.descripcion)}</pro:Descripcion>
              <pro:Estado>${producto.estado}</pro:Estado>
              <pro:IdCategoria>${producto.idCategoria}</pro:IdCategoria>
              <pro:IdProducto>${producto.idProducto}</pro:IdProducto>
              <pro:Nombre>${this.escaparXml(producto.nombre)}</pro:Nombre>
              <pro:Precio>${producto.precio}</pro:Precio>
              <pro:Stock>${producto.stock}</pro:Stock>
            </tem:producto>
          </tem:${accion}>
        </soap:Body>
      </soap:Envelope>
    `.trim();
  }

  private convertirProductos(xml: string): Producto[] {
    const documento =
      new DOMParser().parseFromString(xml, 'text/xml');

    const nodos =
      documento.getElementsByTagNameNS('*', 'Producto');

    return Array.from(nodos).map(nodo =>
      this.convertirNodoProducto(nodo)
    );
  }

 private convertirUnProducto(
  xml: string
): Producto | null {
  const documento =
    new DOMParser().parseFromString(xml, 'text/xml');

  const nodoId =
    documento.getElementsByTagNameNS(
      '*',
      'IdProducto'
    )[0];

  const nodoProducto = nodoId?.parentElement;

  if (!nodoProducto) {
    return null;
  }

  return this.convertirNodoProducto(nodoProducto);
}

  private convertirNodoProducto(nodo: Element): Producto {
    return {
      idProducto: Number(
        this.obtenerTexto(nodo, 'IdProducto')
      ),
      nombre: this.obtenerTexto(nodo, 'Nombre'),
      descripcion: this.obtenerTexto(nodo, 'Descripcion'),
      precio: Number(this.obtenerTexto(nodo, 'Precio')),
      stock: Number(this.obtenerTexto(nodo, 'Stock')),
      estado:
        this.obtenerTexto(nodo, 'Estado').toLowerCase()
        === 'true',
      idCategoria: Number(
        this.obtenerTexto(nodo, 'IdCategoria')
      )
    };
  }

  private convertirCategorias(xml: string): Categoria[] {
    const documento =
      new DOMParser().parseFromString(xml, 'text/xml');

    const nodos =
      documento.getElementsByTagNameNS('*', 'Categoria');

    return Array.from(nodos).map(nodo => ({
      idCategoria: Number(
        this.obtenerTexto(nodo, 'IdCategoria')
      ),
      nombre: this.obtenerTexto(nodo, 'Nombre'),
      descripcion: this.obtenerTexto(
        nodo,
        'Descripcion'
      ),
      estado:
        this.obtenerTexto(nodo, 'Estado').toLowerCase()
        === 'true'
    }));
  }

  private obtenerTexto(
    elemento: Element,
    etiqueta: string
  ): string {
    return elemento
      .getElementsByTagNameNS('*', etiqueta)[0]
      ?.textContent ?? '';
  }

  private obtenerBooleano(
    xml: string,
    etiqueta: string
  ): boolean {
    const documento =
      new DOMParser().parseFromString(xml, 'text/xml');

    const valor =
      documento.getElementsByTagNameNS('*', etiqueta)[0]
        ?.textContent;

    return valor?.toLowerCase() === 'true';
  }

  private escaparXml(valor: string): string {
    return valor
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  }
}