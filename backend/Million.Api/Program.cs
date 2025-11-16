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
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Million Luxury API",
        Version = "v1",
        Description = "API para gestión de propiedades inmobiliarias",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Million Luxury",
            Email = "contact@millionluxury.com"
        }
    });
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
