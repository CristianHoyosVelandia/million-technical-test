using System.Net;
using System.Text.Json;

namespace Million.Api.Middleware;

/// <summary>
/// Middleware para manejar errores de forma centralizada
/// Atrapa todas las excepciones y retorna respuestas JSON consistentes
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
            await _next(context);
        }
        catch (Exception ex)
        {
            // Si algo explota, lo manejamos acá
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        // Log del error para debugging
        _logger.LogError(exception,
            "Unhandled exception occurred. Path: {Path}, Method: {Method}, TraceId: {TraceId}",
            context.Request.Path,
            context.Request.Method,
            context.TraceIdentifier);

        // Determinar qué status code devolver según el tipo de error
        var (statusCode, message) = GetErrorResponse(exception);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var errorResponse = new ErrorResponse
        {
            StatusCode = (int)statusCode,
            Message = message,
            TraceId = context.TraceIdentifier,
            Path = context.Request.Path.Value ?? string.Empty,
            Timestamp = DateTime.UtcNow
        };

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        var json = JsonSerializer.Serialize(errorResponse, jsonOptions);
        await context.Response.WriteAsync(json);
    }

    // Mapea excepciones a códigos HTTP
    private static (HttpStatusCode statusCode, string message) GetErrorResponse(Exception exception)
    {
        return exception switch
        {
            ArgumentException or ArgumentNullException or InvalidOperationException
                => (HttpStatusCode.BadRequest, exception.Message),

            KeyNotFoundException
                => (HttpStatusCode.NotFound, exception.Message),

            UnauthorizedAccessException
                => (HttpStatusCode.Unauthorized, "Unauthorized access"),

            TimeoutException
                => (HttpStatusCode.RequestTimeout, "Request timeout"),

            // Cualquier otra cosa es un 500
            _ => (HttpStatusCode.InternalServerError,
                  "An unexpected error occurred. Please try again later.")
        };
    }
}

// Estructura de la respuesta cuando hay error
public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public string TraceId { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
