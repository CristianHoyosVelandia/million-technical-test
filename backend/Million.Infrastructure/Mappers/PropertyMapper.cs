using Million.Core.Entities;
using Million.Infrastructure.Models;

namespace Million.Infrastructure.Mappers;

/// <summary>
/// Mapper entre Domain Entity (Property) y Infrastructure Model (PropertyModel)
/// Parte del patrón Hexagonal: convierte entre dominio y persistencia
/// </summary>
public static class PropertyMapper
{
    /// <summary>
    /// Convierte PropertyModel (MongoDB) a Property (Dominio)
    /// </summary>
    public static Property ToDomain(PropertyModel model)
    {
        return new Property
        {
            Id = model.Id,
            IdOwner = model.IdOwner,
            Name = model.Name,
            Address = model.Address,
            Price = model.Price,
            ImageUrl = model.ImageUrl,
            CodeInternal = model.CodeInternal,
            Year = model.Year,
            Enabled = model.Enabled,
            CreatedAt = model.CreatedAt,
            UpdatedAt = model.UpdatedAt
        };
    }

    /// <summary>
    /// Convierte Property (Dominio) a PropertyModel (MongoDB)
    /// </summary>
    public static PropertyModel ToModel(Property entity)
    {
        return new PropertyModel
        {
            Id = entity.Id,
            IdOwner = entity.IdOwner,
            Name = entity.Name,
            Address = entity.Address,
            Price = entity.Price,
            ImageUrl = entity.ImageUrl,
            CodeInternal = entity.CodeInternal,
            Year = entity.Year,
            Enabled = entity.Enabled,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    /// <summary>
    /// Convierte lista de PropertyModel a lista de Property
    /// </summary>
    public static IEnumerable<Property> ToDomainList(IEnumerable<PropertyModel> models)
    {
        return models.Select(ToDomain);
    }
}
