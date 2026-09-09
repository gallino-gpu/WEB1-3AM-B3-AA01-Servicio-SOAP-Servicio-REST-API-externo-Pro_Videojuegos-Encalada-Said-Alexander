using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using Microsoft.EntityFrameworkCore;
using VideojuegosSOAP.Data;
using VideojuegosSOAP.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<VideojuegosDBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString(
            "VideojuegosConnection"
        )
    )
);

builder.Services.AddScoped<ProductoService>();

builder.Services
    .AddServiceModelServices()
    .AddServiceModelMetadata();

builder.Services.AddSingleton<IServiceBehavior,
    UseRequestHeadersForMetadataAddressBehavior>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.AllowSynchronousIO = true;
});

var app = builder.Build();

app.UseCors("Angular");

app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder
        .AddService<ProductoService>()
        .AddServiceEndpoint<ProductoService, IProductoService>(
            new BasicHttpBinding(),
            "/ProductoService.svc"
        );
});

var serviceMetadataBehavior =
    app.Services.GetRequiredService<ServiceMetadataBehavior>();

serviceMetadataBehavior.HttpGetEnabled = true;
serviceMetadataBehavior.HttpsGetEnabled = true;

app.Run();