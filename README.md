<div align="center">

  <h1>🎮 GAMECORE</h1>
  <h3>Integración de servicios SOAP/REST, Angular y API externa</h3>

  <p><strong>Proyecto de Programación Web I — Tercero A Matutino</strong></p>

  <p>
    Sistema web para administrar videojuegos, categorías y movimientos de
    inventario mediante SOAP, REST, Angular, SQL Server y CheapShark.
  </p>

  <p>
    <img alt="Angular" src="https://img.shields.io/badge/Angular-Frontend-DD0031?logo=angular&amp;logoColor=white">
    <img alt=".NET" src="https://img.shields.io/badge/.NET-Backend-512BD4?logo=dotnet&amp;logoColor=white">
    <img alt="SOAP" src="https://img.shields.io/badge/SOAP-CoreWCF-1976D2">
    <img alt="REST" src="https://img.shields.io/badge/REST-ASP.NET_Core-00A86B">
    <img alt="SQL Server" src="https://img.shields.io/badge/SQL_Server-Database-CC2927?logo=microsoftsqlserver&amp;logoColor=white">
    <img alt="API externa" src="https://img.shields.io/badge/API_Externa-CheapShark-00FF88">
  </p>

</div>

---

| Información | Detalle |
|:---|:---|
| **Autor** | SAID ALEXANDER ENCALADA LANDETA |
| **Asignatura** | Programación Web I |
| **Paralelo** | Tercero A Matutino |
| **Base de datos** | `Pro_videojuegosSOAP` |
| **Frontend** | Angular |
| **Backends** | SOAP con CoreWCF y REST con ASP.NET Core |
| **API externa** | CheapShark |
| **Estado** | ✅ Completado |

---

## 📑 Tabla de contenido

1. [Descripción general](#descripción-general)
2. [Objetivos](#objetivos)
3. [Arquitectura del sistema](#arquitectura-del-sistema)
4. [Tecnologías utilizadas](#tecnologías-utilizadas)
5. [Funcionalidades](#funcionalidades)
6. [Estructura del repositorio](#estructura-del-repositorio)
7. [Base de datos](#base-de-datos)
8. [Requisitos previos](#requisitos-previos)
9. [Configuración inicial](#configuración-inicial)
10. [Orden de ejecución](#orden-de-ejecución)
11. [Servicio SOAP](#servicio-soap)
12. [Servicio REST](#servicio-rest)
13. [Frontend Angular](#frontend-angular)
14. [API externa CheapShark](#api-externa-cheapshark)
15. [Comparación local y externa](#comparación-local-y-externa)
16. [Pruebas con Postman](#pruebas-con-postman)
17. [Validaciones](#validaciones)
18. [Pruebas funcionales](#pruebas-funcionales)
19. [Solución de problemas](#solución-de-problemas)
20. [Preparación de la entrega](#preparación-de-la-entrega)
21. [Guion sugerido para el video](#guion-sugerido-para-el-video)
22. [Autor](#autor)

---

## 📌 Descripción general

**GameCore** es una aplicación web orientada a la administración de un catálogo de videojuegos y al control de su inventario.

El sistema integra dos proyectos backend independientes y un único frontend:

- **VideojuegosSOAP:** administra categorías y productos mediante mensajes XML.
- **VideojuegosREST:** administra movimientos de inventario mediante solicitudes HTTP y respuestas JSON.
- **VideojuegosSOAPA-app:** aplicación Angular que consume ambos servicios.
- **CheapShark API:** fuente pública externa para consultar ofertas reales de videojuegos.

Los servicios SOAP y REST utilizan la misma base de datos de SQL Server, denominada `Pro_videojuegosSOAP`. De esta manera, una entrada o salida registrada mediante REST actualiza el stock del producto que también se consulta desde SOAP.

La interfaz utiliza un diseño oscuro de estilo Matrix/Gamer y organiza las funcionalidades en cuatro vistas:

1. Página principal.
2. Productos SOAP.
3. Inventario REST.
4. API externa y comparador.

---

## 🎯 Objetivos

### Objetivo general

Construir una interfaz web en Angular que consuma e integre un servicio SOAP, una API REST y una API pública externa relacionada con videojuegos.

### Objetivos específicos

- Administrar categorías y productos mediante SOAP.
- Registrar entradas y salidas de inventario mediante REST.
- Mantener actualizado el stock de cada producto.
- Mostrar los datos locales y externos de manera diferenciada.
- Consultar ofertas reales desde una API pública.
- Comparar un producto local con un videojuego externo.
- Implementar formularios, validaciones, estados de carga y mensajes de error.
- Permitir la navegación entre las diferentes funciones desde un solo frontend.

---

## 🏗️ Arquitectura del sistema

```mermaid
flowchart TD
    A["Usuario"] --> B["Angular :4200"]
    B --> C["Servicio SOAP :5171"]
    B --> D["API REST :5182"]
    B --> E["CheapShark API"]
    C --> F[("SQL Server\nPro_videojuegosSOAP")]
    D --> F
```

### Flujo de datos

| Origen | Tecnología | Datos | Formato |
|---|---|---|---|
| Base de datos local | SQL Server | Categorías, productos y movimientos | Tablas relacionales |
| VideojuegosSOAP | CoreWCF | Categorías y productos | XML/SOAP |
| VideojuegosREST | ASP.NET Core Web API | Movimientos de inventario | JSON/REST |
| CheapShark | API pública | Ofertas, imágenes, precios y valoraciones | JSON |
| VideojuegosSOAPA-app | Angular | Presentación integrada | HTML, CSS y TypeScript |

---

## 🛠️ Tecnologías utilizadas

### Backend SOAP

- C#.
- ASP.NET Core.
- CoreWCF.
- Entity Framework Core.
- SQL Server.
- XML y SOAP.

### Backend REST

- C#.
- .NET 10.
- ASP.NET Core Web API.
- Entity Framework Core SQL Server `10.0.11`.
- Microsoft.AspNetCore.OpenApi `10.0.9`.
- JSON y REST.

### Frontend

- Angular.
- TypeScript.
- HTML5.
- CSS3.
- Bootstrap.
- SweetAlert2.
- HttpClient.
- Formularios con `ngModel`.

### Herramientas

- Visual Studio.
- Visual Studio Code.
- SQL Server Management Studio.
- Postman.
- Git y GitHub.
- Node.js y npm.

### API pública

- [CheapShark API](https://apidocs.cheapshark.com/).
- No requiere clave API para las consultas implementadas.

---

## ✨ Funcionalidades

### Página principal

- Navegación hacia SOAP, REST y API externa.
- Indicadores de productos, stock, entradas y salidas.
- Presentación visual de la arquitectura del proyecto.
- Diseño adaptable a escritorio y dispositivos móviles.

### Módulo SOAP

- Obtener categorías.
- Obtener productos.
- Obtener un producto por ID.
- Agregar productos.
- Actualizar productos.
- Eliminar productos.
- Filtrar productos por categoría.
- Filtrar productos por rango de precios.
- Mostrar categoría, precio, stock y estado.

### Módulo REST

- Obtener la lista de movimientos.
- Obtener un movimiento por ID.
- Registrar movimientos de entrada.
- Registrar movimientos de salida.
- Guardar un movimiento indicando su tipo.
- Actualizar movimientos.
- Eliminar movimientos.
- Aumentar o disminuir automáticamente el stock.
- Revertir y recalcular el stock al actualizar o eliminar.

### API externa

- Consultar ofertas reales de videojuegos.
- Buscar videojuegos por título.
- Mostrar imagen, precio normal y precio de oferta.
- Mostrar descuento, valoración y tienda.
- Abrir la oferta externa en una pestaña nueva.
- Presentar estados de carga, error y resultados vacíos.

### Comparador

- Seleccionar un videojuego desde una tarjeta externa.
- Buscar una coincidencia en el catálogo local.
- Permitir cambiar manualmente el producto local.
- Mostrar los dos productos lado contra lado.
- Comparar precio local y precio externo.
- Calcular la diferencia entre ambos precios.
- Indicar cuál de las dos opciones tiene el menor precio.
- Mantener claramente separados los datos propios y externos.

---

## 🗂️ Estructura del repositorio

```text
Proyecto-Videojuegos/
│
├── ServiciosSOAP/
│   └── VideojuegosSOAP/
│       ├── VideojuegosSOAP.sln
│       ├── Controllers/
│       ├── Data/
│       ├── Models/
│       ├── Services/
│       ├── appsettings.json
│       └── Program.cs
│
├── ServiciosREST/
│   └── VideojuegosREST/
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Models/
│       ├── Services/
│       ├── Properties/
│       ├── VideojuegosREST.csproj
│       ├── appsettings.json
│       └── Program.cs
│
├── FrontendAngular/
│   └── VideojuegosSOAPA-app/
│       ├── src/
│       │   └── app/
│       │       ├── model/
│       │       ├── services/
│       │       ├── app.ts
│       │       ├── app.html
│       │       └── app.css
│       ├── angular.json
│       ├── package.json
│       └── package-lock.json
│
├── SQL/
│   ├── Pro_videojuegosSOAP.sql
│   └── Pro_videojuegosSOAP.bak
│
├── Postman/
│   └── VideojuegosSOAP.postman_collection.json
│
├── Evidencias/
│   ├── SOAP/
│   ├── REST/
│   └── Angular/
│
├── .gitignore
└── README.md
```

> La estructura puede adaptarse a los nombres reales de las carpetas, pero SOAP, REST, Angular, SQL y Postman deben permanecer claramente separados.

---

## 🗄️ Base de datos

### Nombre

```text
Pro_videojuegosSOAP
```

### Tablas

#### Categorias

| Campo | Descripción |
|---|---|
| `IdCategoria` | Clave primaria de la categoría |
| `Nombre` | Nombre de la categoría |
| `Descripcion` | Información descriptiva |
| `Estado` | Indica si se encuentra activa |

#### Productos

| Campo | Descripción |
|---|---|
| `IdProducto` | Clave primaria del producto |
| `Nombre` | Nombre del videojuego |
| `Descripcion` | Descripción del videojuego |
| `Precio` | Precio registrado localmente |
| `Stock` | Cantidad disponible |
| `Estado` | Indica si el producto está activo |
| `IdCategoria` | Clave foránea hacia Categorias |

#### MovimientoInventario

| Campo | Descripción |
|---|---|
| `IdMovimiento` | Clave primaria del movimiento |
| `IdProducto` | Clave foránea hacia Productos |
| `TipoMovimiento` | `ENTRADA` o `SALIDA` |
| `Cantidad` | Unidades ingresadas o retiradas |
| `FechaMovimiento` | Fecha generada por SQL Server |
| `Observacion` | Descripción opcional del movimiento |

### Diagrama de relaciones

```mermaid
erDiagram
    CATEGORIAS ||--o{ PRODUCTOS : contiene
    PRODUCTOS ||--o{ MOVIMIENTO_INVENTARIO : registra

    CATEGORIAS {
        int IdCategoria PK
        string Nombre
        string Descripcion
        boolean Estado
    }

    PRODUCTOS {
        int IdProducto PK
        string Nombre
        string Descripcion
        decimal Precio
        int Stock
        boolean Estado
        int IdCategoria FK
    }

    MOVIMIENTO_INVENTARIO {
        int IdMovimiento PK
        int IdProducto FK
        string TipoMovimiento
        int Cantidad
        datetime FechaMovimiento
        string Observacion
    }
```

### Creación de la base

Existen dos alternativas:

#### Alternativa 1: ejecutar el script

1. Abrir SQL Server Management Studio.
2. Conectarse a la instancia de SQL Server.
3. Abrir `SQL/Pro_videojuegosSOAP.sql`.
4. Ejecutar el script completo.
5. Confirmar que se crearon las tres tablas y sus relaciones.

#### Alternativa 2: restaurar el respaldo

1. Abrir SQL Server Management Studio.
2. Seleccionar **Databases**.
3. Elegir **Restore Database**.
4. Seleccionar el archivo `Pro_videojuegosSOAP.bak`.
5. Restaurar la base con el nombre `Pro_videojuegosSOAP`.

---

## 💻 Requisitos previos

Antes de ejecutar el proyecto se necesita:

- Windows 10 u 11.
- SQL Server.
- SQL Server Management Studio.
- Visual Studio con desarrollo web de ASP.NET instalado.
- .NET 10 SDK para el proyecto REST.
- Visual Studio Code.
- Node.js y npm.
- Angular CLI.
- Postman.
- Git, si se clonará el repositorio.
- Conexión a Internet para consultar CheapShark.

### Verificar instalaciones

```powershell
dotnet --version
node --version
npm --version
ng version
git --version
```

Si Angular CLI no está instalado:

```powershell
npm install -g @angular/cli
```

---

## ⚙️ Configuración inicial

### Cadena de conexión

Los proyectos `VideojuegosSOAP` y `VideojuegosREST` deben conectarse a la misma base de datos.

Revisar `appsettings.json` en los dos backends:

```json
{
  "ConnectionStrings": {
    "VideojuegosConnection": "Server=TU_SERVIDOR;Database=Pro_videojuegosSOAP;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Reemplazar `TU_SERVIDOR` por el nombre real mostrado en SQL Server Management Studio.

Ejemplos habituales:

```text
.
localhost
NOMBRE-PC\SQLEXPRESS
```

> No publicar usuarios, contraseñas, tokens ni cadenas de conexión privadas en GitHub.

### Direcciones utilizadas

| Aplicación | Dirección |
|---|---|
| Servicio SOAP | `http://localhost:5171/ProductoService.svc` |
| WSDL SOAP | `http://localhost:5171/ProductoService.svc?wsdl` |
| API REST | `http://localhost:5182/api/MovimientosInventario` |
| Angular | `http://localhost:4200` |
| CheapShark | `https://www.cheapshark.com/api/1.0/deals` |

Si Visual Studio asigna otro puerto, también se debe actualizar la URL correspondiente en los servicios de Angular y en Postman.

### CORS

La API REST debe permitir solicitudes desde:

```text
http://localhost:4200
```

El middleware de CORS debe ejecutarse antes de mapear los controladores.

---

## ▶️ Orden de ejecución

Para evitar errores de conexión, seguir este orden:

1. Iniciar SQL Server.
2. Crear o restaurar `Pro_videojuegosSOAP`.
3. Revisar las cadenas de conexión de SOAP y REST.
4. Ejecutar `VideojuegosSOAP` desde Visual Studio.
5. Ejecutar `VideojuegosREST` en otra instancia de Visual Studio.
6. Ejecutar Angular desde Visual Studio Code.
7. Abrir `http://localhost:4200`.
8. Probar las solicitudes de Postman con los backends activos.

Los dos backends deben permanecer ejecutándose simultáneamente mientras se utiliza Angular.

---

## 🧩 Servicio SOAP

### Ejecución

1. Abrir la solución `VideojuegosSOAP.sln` en Visual Studio.
2. Revisar `appsettings.json`.
3. Seleccionar el perfil `http`.
4. Ejecutar el proyecto.
5. Comprobar el WSDL en:

```text
http://localhost:5171/ProductoService.svc?wsdl
```

### Operaciones principales

| Operación | Descripción |
|---|---|
| `ObtenerCategorias` | Devuelve las categorías registradas |
| `ObtenerProductos` | Devuelve todos los productos |
| `ObtenerProductoPorId` | Busca un producto por su identificador |
| `AgregarProducto` | Registra un producto |
| `ActualizarProducto` | Modifica un producto existente |
| `EliminarProducto` | Elimina un producto |
| `ObtenerProductosPorPrecio` | Filtra por precio mínimo y máximo |
| `ObtenerProductosPorCategoria` | Filtra por categoría |

Las solicitudes SOAP utilizan XML. La dirección y las acciones exactas pueden verificarse desde el WSDL y ya se encuentran configuradas en la colección de Postman.

### Flujo SOAP

```text
Angular
   ↓ solicitud HTTP POST con XML
ProductoService.svc
   ↓ Entity Framework Core
SQL Server
   ↑ respuesta XML
Angular transforma el XML y muestra los datos
```

---

## ⚡ Servicio REST

### Ejecución

1. Abrir `VideojuegosREST` en Visual Studio.
2. Revisar la cadena de conexión.
3. Seleccionar el perfil `http`.
4. Ejecutar el proyecto.
5. Abrir:

```text
http://localhost:5182/api/MovimientosInventario
```

Si aparece:

```json
[]
```

la API funciona correctamente, pero todavía no existen movimientos registrados.

> REST no utiliza WSDL. El WSDL pertenece únicamente al servicio SOAP.

### Endpoints

| Acción | Método | Endpoint | Body |
|---|---|---|---|
| Obtener lista | GET | `/api/MovimientosInventario` | No |
| Obtener registro | GET | `/api/MovimientosInventario/{id}` | No |
| Agregar entrada | POST | `/api/MovimientosInventario/entrada` | Sí |
| Agregar salida | POST | `/api/MovimientosInventario/salida` | Sí |
| Guardar registro | POST | `/api/MovimientosInventario` | Sí |
| Actualizar registro | PUT | `/api/MovimientosInventario/{id}` | Sí |
| Borrar registro | DELETE | `/api/MovimientosInventario/{id}` | No |

### Body para entrada o salida

```json
{
  "idProducto": 10,
  "cantidad": 5,
  "observacion": "Movimiento de prueba de inventario"
}
```

### Body para guardar o actualizar

```json
{
  "idProducto": 10,
  "tipoMovimiento": "ENTRADA",
  "cantidad": 3,
  "observacion": "Registro general de inventario"
}
```

Valores permitidos para `tipoMovimiento`:

```text
ENTRADA
SALIDA
```

### Códigos de respuesta habituales

| Código | Significado |
|---|---|
| `200 OK` | Consulta o actualización correcta |
| `201 Created` | Movimiento registrado correctamente |
| `204 No Content` | Movimiento eliminado correctamente |
| `400 Bad Request` | Datos o cantidad inválidos |
| `404 Not Found` | Producto o movimiento inexistente |
| `409 Conflict` | Conflicto al actualizar el inventario |
| `405 Method Not Allowed` | Se utilizó un método HTTP incorrecto |

### Reglas del inventario

- Una entrada aumenta el stock.
- Una salida disminuye el stock.
- La cantidad debe ser mayor que cero.
- No se puede generar stock negativo.
- El producto debe existir y encontrarse activo.
- Al actualizar un movimiento se revierte primero el efecto anterior.
- Al eliminar un movimiento se revierte su efecto sobre el stock.
- El movimiento y el stock se guardan juntos en la base de datos.

---

## 🎨 Frontend Angular

### Instalación

Abrir la carpeta:

```text
FrontendAngular/VideojuegosSOAPA-app
```

Instalar las dependencias:

```powershell
npm install
```

Ejecutar Angular:

```powershell
ng serve
```

Abrir:

```text
http://localhost:4200
```

### Módulos principales

| Vista | Fuente |
|---|---|
| Inicio | Resumen integrado |
| Productos SOAP | `ProductoService.svc` |
| Inventario REST | `api/MovimientosInventario` |
| API externa | CheapShark |
| Comparador | Productos locales + ofertas externas |

### Servicios Angular

```text
src/app/services/producto.ts
src/app/services/movimiento-inventario.ts
src/app/services/catalogo-externo.ts
```

### Modelos Angular

```text
src/app/model/producto.model.ts
src/app/model/categoria.model.ts
src/app/model/movimiento-inventario.model.ts
src/app/model/juego-externo.model.ts
```

### Dependencias importantes

El proyecto debe tener configurados:

- `FormsModule`, necesario para `ngModel`.
- `HttpClient`, necesario para realizar solicitudes HTTP.
- SweetAlert2, utilizado para mensajes y confirmaciones.
- Bootstrap, utilizado como apoyo para la estructura adaptable.

---

## 🌐 API externa CheapShark

### Documentación

[https://apidocs.cheapshark.com/](https://apidocs.cheapshark.com/)

### Endpoint utilizado

```http
GET https://www.cheapshark.com/api/1.0/deals
```

### Parámetros principales

| Parámetro | Uso |
|---|---|
| `storeID=1` | Consulta ofertas de Steam |
| `pageNumber=0` | Solicita la primera página |
| `pageSize=12` | Limita la respuesta a 12 resultados |
| `sortBy=Deal Rating` | Ordena por calidad de la oferta |
| `title` | Filtra por título cuando existe una búsqueda |

Ejemplo:

```http
GET https://www.cheapshark.com/api/1.0/deals?storeID=1&pageNumber=0&pageSize=12&sortBy=Deal%20Rating
```

### Campos presentados

- Título.
- Imagen.
- Precio normal.
- Precio de oferta.
- Porcentaje de ahorro.
- Valoración de Steam.
- Puntuación de Metacritic, cuando está disponible.
- Enlace externo de la oferta.

### Consideraciones

- La consulta se realiza directamente desde Angular.
- No reemplaza los servicios SOAP o REST del proyecto.
- Sus resultados no se guardan en SQL Server.
- Requiere conexión a Internet.
- Las ofertas pueden cambiar con el tiempo.
- No requiere una clave API para las consultas implementadas.

---

## ⚖️ Comparación local y externa

El comparador demuestra la integración de fuentes distintas dentro de una misma interfaz.

### Uso

1. Abrir **API externa**.
2. Esperar que se carguen las ofertas.
3. Presionar **Comparar con catálogo local** en una tarjeta.
4. El sistema selecciona el videojuego externo.
5. Si existe una coincidencia de nombre, intenta seleccionar el producto local relacionado.
6. Si no existe coincidencia, utiliza un producto local como referencia y permite cambiarlo.
7. El panel muestra ambos registros lado contra lado.

### Datos locales

- Nombre.
- Descripción.
- Categoría.
- Stock.
- Estado.
- Precio local.
- Origen SQL Server y SOAP.

### Datos externos

- Nombre.
- Imagen.
- Precio normal.
- Precio de oferta.
- Descuento.
- Valoración.
- Origen CheapShark.

### Resultado

El sistema calcula la diferencia absoluta entre los precios e indica si el menor precio pertenece al catálogo local, a la oferta externa o si ambos son iguales.

> La comparación es informativa. Los productos pueden pertenecer a ediciones o tiendas diferentes.

---

## 🧪 Pruebas con Postman

### Importar la colección

1. Abrir Postman.
2. Seleccionar **Import**.
3. Elegir:

```text
Postman/VideojuegosSOAP.postman_collection.json
```

4. Mantener SOAP y REST ejecutándose.
5. Verificar que los puertos coincidan con los configurados.

### Pruebas SOAP

La colección incluye solicitudes XML para consultar, agregar, actualizar, eliminar y filtrar productos.

Los encabezados necesarios para SOAP, como el tipo de contenido y la acción, deben conservarse como se encuentran configurados en la colección.

### Pruebas REST

Para GET y DELETE no se utiliza Body.

Para POST y PUT:

1. Abrir **Body**.
2. Seleccionar **raw**.
3. Seleccionar **JSON**.
4. Pegar el objeto correspondiente.

No es necesario agregar encabezados personalizados manualmente. Postman puede mostrar encabezados automáticos u ocultos cuando se selecciona JSON.

### Orden recomendado de pruebas REST

1. Obtener lista.
2. Agregar movimiento por entrada.
3. Agregar movimiento por salida.
4. Obtener un registro por ID.
5. Guardar un registro general.
6. Actualizar un registro.
7. Borrar un registro.
8. Obtener nuevamente la lista para comprobar el resultado.

---

## 🛡️ Validaciones

### Productos

- Nombre obligatorio.
- Descripción obligatoria.
- Categoría obligatoria.
- Precio igual o mayor que cero.
- Stock igual o mayor que cero.
- Estado activo o inactivo.
- Confirmación antes de eliminar.
- Protección al eliminar productos relacionados con movimientos.

### Movimientos

- Producto obligatorio.
- Tipo `ENTRADA` o `SALIDA`.
- Cantidad mayor que cero.
- Observación de máximo 500 caracteres.
- Producto existente y activo.
- Validación de stock suficiente.
- Protección contra valores superiores al límite permitido.
- Confirmación antes de borrar.
- Reversión del stock al actualizar o eliminar.

### API externa

- Indicador mientras se realiza la consulta.
- Mensaje cuando no existen resultados.
- Mensaje cuando ocurre un error de conexión.
- Botón para intentar nuevamente.
- Limpieza del texto de búsqueda.
- Apertura segura de enlaces externos.

### Interfaz

- Navegación entre todas las pantallas.
- Mensajes de éxito con SweetAlert2.
- Mensajes de advertencia y error.
- Confirmaciones de eliminación.
- Diseño adaptable.
- Separación visual entre datos locales y externos.

---

## ✅ Pruebas funcionales

Antes de entregar, verificar:

- [ ] SQL Server está activo.
- [ ] La base contiene las tres tablas.
- [ ] El servicio SOAP abre su WSDL.
- [ ] El servicio REST devuelve `200 OK`.
- [ ] Angular inicia sin errores de compilación.
- [ ] La consola del navegador no presenta errores.
- [ ] Se cargan las categorías y productos.
- [ ] Se puede agregar y actualizar un producto.
- [ ] Los filtros SOAP funcionan.
- [ ] Se puede registrar una entrada.
- [ ] La entrada aumenta el stock.
- [ ] Se puede registrar una salida.
- [ ] La salida disminuye el stock.
- [ ] Una salida excesiva muestra un error.
- [ ] Se puede actualizar un movimiento.
- [ ] Se puede eliminar un movimiento.
- [ ] CheapShark devuelve ofertas.
- [ ] El buscador externo funciona.
- [ ] El comparador muestra los dos productos lado contra lado.
- [ ] La diferencia de precios es correcta.
- [ ] La colección de Postman puede importarse.

---

## 🔧 Solución de problemas

### `ng` o `npm` no se reconoce

Instalar Node.js y Angular CLI. Después cerrar y volver a abrir PowerShell o Visual Studio Code.

```powershell
npm install -g @angular/cli
```

### `Can't bind to ngModel`

Confirmar que `FormsModule` esté importado en el módulo Angular correspondiente.

### `Property ... does not exist on type App`

El HTML está llamando a un método que no existe, está repetido o quedó fuera de la clase `App`. Revisar el nombre y guardar `app.ts`.

### Error de CORS

Confirmar que REST permita `http://localhost:4200` y que el middleware de CORS esté activado.

### `405 Method Not Allowed`

Revisar el método seleccionado en Postman:

- Entrada y salida: POST.
- Actualizar: PUT.
- Borrar: DELETE.
- Consultar: GET.

### REST devuelve `[]`

La API funciona, pero la tabla de movimientos no contiene registros.

### No carga SOAP

- Comprobar que Visual Studio continú ejecutando el servicio.
- Revisar el puerto `5171`.
- Abrir el WSDL.
- Revisar la cadena de conexión.

### No carga REST

- Comprobar que `VideojuegosREST` esté ejecutándose.
- Revisar el puerto `5182`.
- Abrir el endpoint GET en el navegador.
- Revisar CORS y la cadena de conexión.

### No carga CheapShark

- Revisar la conexión a Internet.
- Probar sin texto de búsqueda.
- Revisar la consola del navegador.
- Presionar **Intentar nuevamente**.

### Los estilos no cambian

1. Guardar `app.css`.
2. Confirmar que `styleUrl` apunte a `./app.css`.
3. Esperar que Angular compile.
4. Actualizar el navegador con `Ctrl + F5`.

---

## 📦 Preparación de la entrega

### Archivos obligatorios

- Enlace del repositorio GitHub.
- `README.md`.
- Video demostrativo de máximo 5 minutos.
- Script de la base de datos.
- Colección de Postman.
- Proyectos SOAP y REST.
- Proyecto Angular.

### No subir al repositorio

```text
node_modules/
bin/
obj/
.vs/
.angular/
dist/
.vscode/
```

Tampoco se deben publicar:

- Contraseñas.
- Tokens.
- Claves API privadas.
- Cadenas de conexión reales con credenciales.
- Archivos temporales del sistema.

### `.gitignore` recomendado

```gitignore
# Angular
node_modules/
dist/
.angular/

# Visual Studio
.vs/
bin/
obj/
*.user
*.suo

# Visual Studio Code
.vscode/

# Sistema
Thumbs.db
.DS_Store

# Variables y secretos
.env
.env.*
appsettings.Development.json
```

> Antes de ignorar `appsettings.Development.json`, verificar que el proyecto pueda ejecutarse con un archivo de configuración de ejemplo o con instrucciones claras en este README.

---

## 🎥 Guion sugerido para el video

El video debe durar menos de 5 minutos.

### Orden recomendado

1. Presentar el nombre y objetivo del proyecto.
2. Mostrar la arquitectura en la página principal.
3. Ingresar en SOAP y realizar una consulta.
4. Ingresar en REST y registrar una entrada o salida.
5. Comprobar el cambio del stock.
6. Abrir la API externa y realizar una búsqueda.
7. Seleccionar una oferta y mostrar la comparación.
8. Explicar la diferencia entre datos locales y externos.
9. Cerrar con las tecnologías utilizadas.

### Servicios que deben estar activos

```text
SOAP:    http://localhost:5171
REST:    http://localhost:5182
Angular: http://localhost:4200
```

---

## 📊 Estado del proyecto

| Componente | Estado |
|---|---|
| Base de datos | Completado |
| Servicio SOAP | Completado |
| API REST | Completado |
| Frontend Angular | Completado |
| API externa | Completado |
| Comparador | Completado |
| Pruebas Postman | Completado |
| Diseño Matrix/Gamer | Completado |

---

## 👤 Autor

**SAID ALEXANDER ENCALADA LANDETA**  
Carrera: Desarrollo de Software  
Asignatura: Programación Web I  
Paralelo: Tercero A Matutino  
Año: 2026

---

## 📜 Licencia

Proyecto desarrollado con fines académicos para la asignatura Programación Web I.

---

<div align="center">

**GAMECORE — SOAP + REST + ANGULAR + API EXTERNA**

</div>
