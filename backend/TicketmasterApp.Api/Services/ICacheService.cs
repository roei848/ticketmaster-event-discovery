namespace TicketmasterApp.Api.Services;

public interface ICacheService
{
    T? Get<T>(string key);
    void Set<T>(string key, T value, TimeSpan expiration);
    string GenerateSearchKey(string city, int radius, List<string> eventTypes, string? startDate = null, string? endDate = null);
}
