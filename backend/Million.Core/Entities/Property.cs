namespace Million.Core.Entities;

/// <summary>
/// Entidad de dominio Property (Domain Model - Hexagonal Architecture)
/// Esta clase es PURA y NO debe tener dependencias de infraestructura (MongoDB, EF, etc.)
/// </summary>
public class Property
{
    public string Id { get; set; } = string.Empty;
    public string IdOwner { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string CodeInternal { get; set; } = string.Empty;
    public int Year { get; set; }
    public bool Enabled { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
