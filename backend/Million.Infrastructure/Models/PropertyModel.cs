using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Million.Infrastructure.Models;

/// <summary>
/// Modelo de persistencia para MongoDB (Infrastructure Layer - Hexagonal Architecture)
/// Este modelo SÍ puede tener dependencias de MongoDB (es un ADAPTER)
/// Mapea la entidad de dominio Property a la estructura de MongoDB
/// </summary>
[BsonIgnoreExtraElements]
public class PropertyModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("idOwner")]
    public string IdOwner { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;

    [BsonElement("price")]
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Price { get; set; }

    [BsonElement("imageUrl")]
    public string ImageUrl { get; set; } = string.Empty;

    [BsonElement("codeInternal")]
    public string CodeInternal { get; set; } = string.Empty;

    [BsonElement("year")]
    public int Year { get; set; }

    [BsonElement("enabled")]
    public bool Enabled { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; }

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}
