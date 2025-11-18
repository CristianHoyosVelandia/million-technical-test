using Million.Core.Entities;
using Million.Infrastructure.Models;

namespace Million.Infrastructure.Mappers;

/// <summary>
/// Mapper entre la entidad de dominio y el modelo de BD
/// Convierte Property (dominio) ↔ PropertyModel (MongoDB)
/// </summary>
public static class PropertyMapper
{
  // De BD a dominio
  public static Property ToDomain(PropertyModel model) {
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

  // De dominio a BD
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

  // Helper para convertir listas
  public static IEnumerable<Property> ToDomainList(IEnumerable<PropertyModel> models)
  {
    return models.Select(ToDomain);
  }
}
