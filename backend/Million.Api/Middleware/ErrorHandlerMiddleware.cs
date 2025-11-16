using System.Net;
using System.Text.Json;

namespace Million.Api.Middleware;

/// <summary>
/// Middleware para manejo centralizado de errores en la aplicación
/// Captura todas las excepciones no manejadas y retorna respuestas JSON consistentes
/// </summary>
public class ErrorHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlerMiddleware> _logger;

    public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Ejecutar el siguiente middleware en la pipeline
            await _next(context);
        }
        catch (Exception ex)
        {
            // Capturar y manejar cualquier excepción no controlada
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        // Log del error con detalles completos
        _logger.LogError(exception,
            "Unhandled exception occurred. Path: {Path}, Method: {Method}, TraceId: {TraceId}",
            context.Request.Path,
            context.Request.Method,
            context.TraceIdentifier);

        // Determinar el status code apropiado según el tipo de excepción
        var (statusCode, message) = GetErrorResponse(exception);

        // Configurar la respuesta HTTP
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        // Crear objeto de respuesta consistente
        var errorResponse = new ErrorResponse
        {
            StatusCode = (int)statusCode,
            Message = message,
            TraceId = context.TraceIdentifier,
            Path = context.Request.Path.Value ?? string.Empty,
            Timestamp = DateTime.UtcNow
        };

        // Serializar y enviar la respuesta
        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        var json = JsonSerializer.Serialize(errorResponse, jsonOptions);
        await context.Response.WriteAsync(json);
    }

    /// <summary>
    /// Determina el status code y mensaje apropiado según el tipo de excepción
    /// </summary>
    private static (HttpStatusCode statusCode, string message) GetErrorResponse(Exception exception)
    {
        return exception switch
        {
            // Errores de validación (Bad Request)
            ArgumentException or ArgumentNullException or InvalidOperationException
                => (HttpStatusCode.BadRequest, exception.Message),

            // Not Found
            KeyNotFoundException
                => (HttpStatusCode.NotFound, exception.Message),

            // Unauthorized
            UnauthorizedAccessException
                => (HttpStatusCode.Unauthorized, "Unauthorized access"),

            // Timeout
            TimeoutException
                => (HttpStatusCode.RequestTimeout, "Request timeout"),

            // Default: Internal Server Error
            _ => (HttpStatusCode.InternalServerError,
                  "An unexpected error occurred. Please try again later.")
        };
    }
}

/// <summary>
/// Estructura de respuesta de error consistente
/// </summary>
public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public string TraceId { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
