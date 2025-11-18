using Microsoft.Extensions.Options;
using Million.Infrastructure.Configuration;
using Million.Infrastructure.Models;
using MongoDB.Driver;

namespace Million.Infrastructure.Data;

/// <summary>
/// Contexto de MongoDB - provee acceso a las colecciones
/// </summary>
public class MongoDbContext
{
  private readonly IMongoDatabase _database;

  public MongoDbContext(IOptions<MongoDbSettings> settings) {
    var mongoSettings = settings.Value;
    var client = new MongoClient(mongoSettings.ConnectionString);
    _database = client.GetDatabase(mongoSettings.DatabaseName);
  }

  // Colección de propiedades - usa PropertyModel porque es el modelo de BD
  public IMongoCollection<PropertyModel> Properties =>
    _database.GetCollection<PropertyModel>("properties");
}
