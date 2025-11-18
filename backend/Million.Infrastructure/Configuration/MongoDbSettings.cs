namespace Million.Infrastructure.Configuration;

/// <summary>
/// Settings de MongoDB - se cargan desde appsettings.json
/// </summary>
public class MongoDbSettings
{
  public string ConnectionString { get; set; } = "mongodb://localhost:27017";
  public string DatabaseName { get; set; } = "milliondb";
  public string PropertiesCollectionName { get; set; } = "properties";
}
