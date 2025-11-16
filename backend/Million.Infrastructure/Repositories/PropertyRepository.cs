using Million.Core.Entities;
using Million.Core.Interfaces;
using Million.Infrastructure.Data;
using Million.Infrastructure.Mappers;
using Million.Infrastructure.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Million.Infrastructure.Repositories;

/// <summary>
/// ADAPTER (Hexagonal Architecture): Implementa el PORT (IPropertyRepository)
/// Usa MongoDB como tecnología de persistencia
/// </summary>
public class PropertyRepository : IPropertyRepository
{
    private readonly IMongoCollection<PropertyModel> _collection;

    public PropertyRepository(MongoDbContext context)
    {
        _collection = context.Properties;
    }

    public async Task<(IEnumerable<Property> properties, long totalCount)> GetListAsync(
        string? name,
        string? address,
        decimal? minPrice,
        decimal? maxPrice,
        int page,
        int pageSize)
    {
        // 1. Construir filtros dinámicos con FilterBuilder
        var filterBuilder = Builders<PropertyModel>.Filter;
        var filters = new List<FilterDefinition<PropertyModel>>
        {
            // Siempre filtrar por propiedades habilitadas
            filterBuilder.Eq(p => p.Enabled, true)
        };

        // Filtro por nombre (case insensitive, búsqueda parcial)
        if (!string.IsNullOrWhiteSpace(name))
        {
            filters.Add(filterBuilder.Regex(
                p => p.Name,
                new BsonRegularExpression(name, "i") // "i" = case insensitive
            ));
        }

        // Filtro por dirección (case insensitive, búsqueda parcial)
        if (!string.IsNullOrWhiteSpace(address))
        {
            filters.Add(filterBuilder.Regex(
                p => p.Address,
                new BsonRegularExpression(address, "i")
            ));
        }

        // Filtro por precio mínimo (Greater Than or Equal)
        if (minPrice.HasValue)
        {
            filters.Add(filterBuilder.Gte(p => p.Price, minPrice.Value));
        }

        // Filtro por precio máximo (Less Than or Equal)
        if (maxPrice.HasValue)
        {
            filters.Add(filterBuilder.Lte(p => p.Price, maxPrice.Value));
        }

        // Combinar todos los filtros con AND
        var combinedFilter = filterBuilder.And(filters);

        // 2. Obtener total de registros (para metadata de paginación)
        var totalCount = await _collection.CountDocumentsAsync(combinedFilter);

        // 3. Obtener lista paginada con Skip y Limit
        var models = await _collection
            .Find(combinedFilter)
            .Sort(Builders<PropertyModel>.Sort.Descending(p => p.CreatedAt)) // Ordenar por más recientes
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        // 4. ✅ HEXAGONAL: Mapear de PropertyModel (Infrastructure) → Property (Domain)
        var properties = PropertyMapper.ToDomainList(models);

        return (properties, totalCount);
    }

    public async Task<Property?> GetByIdAsync(string id)
    {
        // Buscar por ID y que esté habilitado
        var model = await _collection
            .Find(p => p.Id == id && p.Enabled)
            .FirstOrDefaultAsync();

        // ✅ HEXAGONAL: Mapear de PropertyModel → Property (o null si no existe)
        return model != null ? PropertyMapper.ToDomain(model) : null;
    }
}
