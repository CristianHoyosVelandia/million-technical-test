using Microsoft.Extensions.Options;
using Million.Infrastructure.Configuration;
using Million.Infrastructure.Models;
using MongoDB.Driver;

namespace Million.Infrastructure.Data;

/// <summary>
/// Contexto de MongoDB (Hexagonal Architecture - Infrastructure Layer)
/// Proporciona acceso a las colecciones de MongoDB
/// </summary>
public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IOptions<MongoDbSettings> settings)
    {
        var mongoSettings = settings.Value;
        var client = new MongoClient(mongoSettings.ConnectionString);
        _database = client.GetDatabase(mongoSettings.DatabaseName);
    }

    /// <summary>
    /// Colección de propiedades en MongoDB
    /// Usa PropertyModel (no Property) porque es el modelo de persistencia
    /// </summary>
    public IMongoCollection<PropertyModel> Properties =>
        _database.GetCollection<PropertyModel>("properties");
}
