using Million.Core.Entities;

namespace Million.Core.Interfaces;

/// <summary>
/// PORT (Hexagonal Architecture): Contrato definido por el dominio
/// La infraestructura (MongoDB) DEBE implementar este contrato
/// </summary>
public interface IPropertyRepository
{
    /// <summary>
    /// Obtiene una lista paginada de propiedades con filtros opcionales
    /// </summary>
    /// <param name="name">Filtro por nombre (búsqueda parcial, case insensitive)</param>
    /// <param name="address">Filtro por dirección (búsqueda parcial, case insensitive)</param>
    /// <param name="minPrice">Precio mínimo</param>
    /// <param name="maxPrice">Precio máximo</param>
    /// <param name="page">Número de página (1-based)</param>
    /// <param name="pageSize">Cantidad de elementos por página</param>
    /// <returns>Tupla con lista de propiedades y total de registros</returns>
    Task<(IEnumerable<Property> properties, long totalCount)> GetListAsync(
        string? name,
        string? address,
        decimal? minPrice,
        decimal? maxPrice,
        int page,
        int pageSize
    );

    /// <summary>
    /// Obtiene una propiedad por su ID
    /// </summary>
    /// <param name="id">ID de la propiedad</param>
    /// <returns>Propiedad si existe, null si no se encuentra</returns>
    Task<Property?> GetByIdAsync(string id);
}
