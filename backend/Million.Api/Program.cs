using Microsoft.OpenApi.Models;
using Million.Core.Interfaces;
using Million.Infrastructure.Configuration;
using Million.Infrastructure.Data;
using Million.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ===== Configuración de MongoDB =====
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings")
);

// ===== Registro de Servicios (Dependency Injection) =====
// MongoDbContext (Singleton - una instancia para toda la aplicación)
builder.Services.AddSingleton<MongoDbContext>();

// Repository (Scoped - una instancia por request HTTP)
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();

// ===== CORS (permitir requests desde frontend) =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // Vite dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ===== Controllers =====
builder.Services.AddControllers();

// ===== Swagger/OpenAPI =====
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Million Luxury API",
        Version = "v1",
        Description = @"
API RESTful para gestión de propiedades inmobiliarias.

**Características:**
- Listado de propiedades con paginación
- Filtros por nombre, dirección y rango de precio
- Búsqueda case-insensitive
- Arquitectura Hexagonal (Clean Architecture)
- MongoDB como base de datos

**Desarrollado por:** Cristian Hoyos
**Año:** 2025
",
        Contact = new OpenApiContact
        {
            Name = "Million Luxury",
            Email = "contact@millionluxury.com",
            Url = new Uri("https://millionluxury.com")
        },
        License = new OpenApiLicense
        {
            Name = "MIT License",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });

    // Incluir XML comments para documentación enriquecida
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);

    // Habilitar anotaciones para mejor documentación
    options.EnableAnnotations();
});

var app = builder.Build();

// ===== Middleware Pipeline =====

// Swagger (solo en desarrollo)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Million Luxury API v1");
        options.RoutePrefix = "swagger"; // Accesible en /swagger
    });
}

// CORS
app.UseCors("AllowFrontend");

// HTTPS Redirection
app.UseHttpsRedirection();

// Authorization (para futuras features con autenticación)
app.UseAuthorization();

// Map Controllers
app.MapControllers();

app.Run();
