using Microsoft.Extensions.Caching.Memory;

namespace TicketmasterApp.Api.Services;

public class CacheService : ICacheService
{
    private readonly IMemoryCache _cache;

    public CacheService(IMemoryCache cache)
    {
        _cache = cache;
    }

    public T? Get<T>(string key)
    {
        return _cache.TryGetValue(key, out T? value) ? value : default;
    }

    public void Set<T>(string key, T value, TimeSpan expiration)
    {
        _cache.Set(key, value, expiration);
    }

    public string GenerateSearchKey(string city, int radius, List<string> eventTypes, string? startDate = null, string? endDate = null)
    {
        var eventTypesString = eventTypes.Any()
            ? string.Join("-", eventTypes.OrderBy(t => t))
            : "all";

        var dateString = string.Empty;
        if (!string.IsNullOrEmpty(startDate) || !string.IsNullOrEmpty(endDate))
        {
            dateString = $"_{startDate ?? "any"}_{endDate ?? "any"}";
        }

        return $"events_{city.ToLower()}_{radius}_{eventTypesString}{dateString}";
    }
}
