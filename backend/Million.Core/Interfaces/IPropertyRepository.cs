using Million.Core.Entities;

namespace Million.Core.Interfaces;

/// <summary>
/// Interfaz del repositorio de propiedades (Port en arquitectura hexagonal)
/// El dominio define el contrato, la infraestructura lo implementa
/// </summary>
public interface IPropertyRepository
{
  // Lista paginada con filtros opcionales
  Task<(IEnumerable<Property> properties, long totalCount)> GetListAsync(
    string? name,
    string? address,
    decimal? minPrice,
    decimal? maxPrice,
    int page,
    int pageSize
  );

  // Buscar por ID
  Task<Property?> GetByIdAsync(string id);
}
