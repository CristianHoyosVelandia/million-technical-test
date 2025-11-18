namespace Million.Core.DTOs;

/// <summary>
/// DTO para representar una propiedad en las respuestas de la API
/// Solo exponemos los campos que el frontend necesita ver
/// </summary>
public class PropertyDto
{
  /// <summary>
  /// ID único de la propiedad (ObjectId de MongoDB)
  /// </summary>
  /// <example>507f1f77bcf86cd799439011</example>
  public string Id { get; set; } = string.Empty;

  /// <summary>
  /// ID del propietario
  /// </summary>
  /// <example>owner123</example>
  public string IdOwner { get; set; } = string.Empty;

  /// <summary>
  /// Nombre de la propiedad
  /// </summary>
  /// <example>Casa en Bogotá</example>
  public string Name { get; set; } = string.Empty;

  /// <summary>
  /// Dirección
  /// </summary>
  /// <example>Calle 123 #45-67, Bogotá, Colombia</example>
  public string Address { get; set; } = string.Empty;

  /// <summary>
  /// Precio en COP
  /// </summary>
  /// <example>250000</example>
  public decimal Price { get; set; }

  /// <summary>
  /// URL de la imagen
  /// </summary>
  /// <example>https://example.com/images/property1.jpg</example>
  public string ImageUrl { get; set; } = string.Empty;
}
