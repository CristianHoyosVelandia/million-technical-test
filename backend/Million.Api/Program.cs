using Microsoft.OpenApi.Models;
using Million.Api.Middleware;
using Million.Core.Interfaces;
using Million.Infrastructure.Configuration;
using Million.Infrastructure.Data;
using Million.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configuración de MongoDB desde appsettings.json
builder.Services.Configure<MongoDbSettings>(
  builder.Configuration.GetSection("MongoDbSettings")
);

// Inyección de dependencias
builder.Services.AddSingleton<MongoDbContext>(); // una sola instancia para toda la app
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>(); // una por request

// CORS para que el frontend pueda conectarse sin problemas
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowFrontend", policy =>
  {
    policy.WithOrigins(
      "http://localhost:3000",
      "http://localhost:5173" // puerto de Vite
    ).AllowAnyHeader()
    .AllowAnyMethod();
  });
});

builder.Services.AddControllers();

// Swagger para documentar la API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Million Luxury API",
        Version = "v1",
        Description = @"
API RESTful para gestión de propiedades inmobiliarias / Arquitectura Hexagonal (Clean Architecture).

**Características:**
- Listado de propiedades con paginación
- Filtros por nombre, dirección y rango de precio
- Búsqueda case-insensitive

**Desarrollado por:** Cristian Hoyos
**Año:** 2025
",
        License = new OpenApiLicense
        {
            Name = "MIT License",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });

    // Incluir los XML comments en Swagger
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);

    options.EnableAnnotations();
});

var app = builder.Build();

// Middleware pipeline - el orden importa aquí

// Error handler va primero para atrapar todos los errores
app.UseMiddleware<ErrorHandlerMiddleware>();

// Swagger solo en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Million Luxury API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthorization(); // para cuando agreguemos autenticación
app.MapControllers();

app.Run();
