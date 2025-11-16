namespace Million.Core.DTOs;

/// <summary>
/// DTO para representar una propiedad en respuestas de API
/// </summary>
public class PropertyDto
{
    /// <summary>
    /// ID único de la propiedad (ObjectId de MongoDB)
    /// </summary>
    /// <example>507f1f77bcf86cd799439011</example>
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// ID del propietario de la propiedad
    /// </summary>
    /// <example>owner123</example>
    public string IdOwner { get; set; } = string.Empty;

    /// <summary>
    /// Nombre o título de la propiedad
    /// </summary>
    /// <example>Casa en Bogotá</example>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Dirección completa de la propiedad
    /// </summary>
    /// <example>Calle 123 #45-67, Bogotá, Colombia</example>
    public string Address { get; set; } = string.Empty;

    /// <summary>
    /// Precio de la propiedad en la moneda local
    /// </summary>
    /// <example>250000</example>
    public decimal Price { get; set; }

    /// <summary>
    /// URL de la imagen principal de la propiedad
    /// </summary>
    /// <example>https://example.com/images/property1.jpg</example>
    public string ImageUrl { get; set; } = string.Empty;
}
