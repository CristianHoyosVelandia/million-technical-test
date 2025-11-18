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
public class PropertyRepository : IPropertyRepository {

  private readonly IMongoCollection<PropertyModel> _collection;

  public PropertyRepository(MongoDbContext context) {
    _collection = context.Properties;
  }

  public async Task<(IEnumerable<Property> properties, long totalCount)> GetListAsync(
    string? name, string? address, decimal? minPrice, decimal? maxPrice, int page, int pageSize 
  ){
      // Construir los filtros dinámicamente según lo que venga
      var filterBuilder = Builders<PropertyModel>.Filter;
      var filters = new List<FilterDefinition<PropertyModel>> {
        filterBuilder.Eq(p => p.Enabled, true) // Solo propiedades activas
      };

      // Búsqueda por nombre - usando regex para que sea flexible
      if (!string.IsNullOrWhiteSpace(name)) {
        filters.Add(filterBuilder.Regex(
          p => p.Name,
          new BsonRegularExpression(name, "i") // la "i" hace que ignore mayúsculas/minúsculas
        ));
      }

      // Mismo concepto para la dirección
      if (!string.IsNullOrWhiteSpace(address)) {
        filters.Add(filterBuilder.Regex(
          p => p.Address,
          new BsonRegularExpression(address, "i")
        ));
      }

      // Rangos de precio - pretty straightforward
      if (minPrice.HasValue) {
        filters.Add(filterBuilder.Gte(p => p.Price, minPrice.Value));
      }

      if (maxPrice.HasValue) {
        filters.Add(filterBuilder.Lte(p => p.Price, maxPrice.Value));
      }

      var combinedFilter = filterBuilder.And(filters);

      // Necesitamos el total para la paginación
      var totalCount = await _collection.CountDocumentsAsync(combinedFilter);

      // Traer solo la página que se pidió
      var models = await _collection
        .Find(combinedFilter)
        .Sort(Builders<PropertyModel>.Sort.Descending(p => p.CreatedAt)) // más nuevas primero
        .Skip((page - 1) * pageSize)
        .Limit(pageSize)
        .ToListAsync();

      // Convertir de modelo de BD a entidad de dominio
      var properties = PropertyMapper.ToDomainList(models);

      return (properties, totalCount);
  }

  public async Task<Property?> GetByIdAsync(string id)
  {
    var model = await _collection
    .Find(p => p.Id == id && p.Enabled)
    .FirstOrDefaultAsync();

    return model != null ? PropertyMapper.ToDomain(model) : null;
  }
}
