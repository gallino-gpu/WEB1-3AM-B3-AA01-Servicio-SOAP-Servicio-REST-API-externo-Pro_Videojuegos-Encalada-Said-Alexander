using Microsoft.EntityFrameworkCore;
using VideojuegosREST.Data;
using VideojuegosREST.Services;

var builder = WebApplication.CreateBuilder(args);

// Habilitar los controladores REST.
builder.Services.AddControllers();

// Respuestas estándar para errores no controlados.
builder.Services.AddProblemDetails();

// Leer la conexión configurada en appsettings.json.
var cadenaConexion = builder.Configuration
    .GetConnectionString("VideojuegosConnection")
    ?? throw new InvalidOperationException(
        "No se encontró la conexión VideojuegosConnection."
    );

// Registrar el contexto de SQL Server.
builder.Services.AddDbContext<VideojuegosDbContext>(options =>
    options.UseSqlServer(cadenaConexion)
);

// Permitir solicitudes desde nuestro Angular.
builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<MovimientoInventarioService>();

var app = builder.Build();

app.UseExceptionHandler();

// Durante el desarrollo local utilizaremos el perfil HTTP.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();

app.UseCors("Angular");

app.MapControllers();

app.Run();