using System.Text.Json;
using System.Text.Json.Serialization;
using TicketmasterApp.Api.Models;

namespace TicketmasterApp.Api.Services;

public class TicketmasterService : ITicketmasterService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<TicketmasterService> _logger;

    public TicketmasterService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<TicketmasterService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<List<Event>> SearchEventsAsync(SearchRequest request)
    {
        var apiKey = _configuration["Ticketmaster:ApiKey"];
        var baseUrl = _configuration["Ticketmaster:BaseUrl"];

        var geoPoint = $"{request.Latitude},{request.Longitude}";
        var radius = request.Radius;

        var url = $"{baseUrl}events.json?apikey={apiKey}&geoPoint={geoPoint}&radius={radius}&size=50&unit=miles";

        if (request.EventTypes.Any())
        {
            var classificationName = string.Join(",", request.EventTypes);
            url += $"&classificationName={classificationName}";
        }

        if (!string.IsNullOrEmpty(request.StartDate))
        {
            url += $"&startDateTime={request.StartDate}T00:00:00Z";
        }

        if (!string.IsNullOrEmpty(request.EndDate))
        {
            url += $"&endDateTime={request.EndDate}T23:59:59Z";
        }

        try
        {
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                UnmappedMemberHandling = JsonUnmappedMemberHandling.Skip
            };
            var ticketmasterResponse = JsonSerializer.Deserialize<TicketmasterEventsResponse>(content, options);

            return MapToEvents(ticketmasterResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Ticketmaster API");
            return new List<Event>();
        }
    }

    public async Task<EventDetail?> GetEventDetailAsync(string eventId)
    {
        var apiKey = _configuration["Ticketmaster:ApiKey"];
        var baseUrl = _configuration["Ticketmaster:BaseUrl"];

        var url = $"{baseUrl}events/{eventId}.json?apikey={apiKey}";

        try
        {
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                UnmappedMemberHandling = JsonUnmappedMemberHandling.Skip
            };
            var ticketmasterEvent = JsonSerializer.Deserialize<TicketmasterEventResponse>(content, options);

            return MapToEventDetail(ticketmasterEvent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting event detail from Ticketmaster");
            return null;
        }
    }

    private List<Event> MapToEvents(TicketmasterEventsResponse? response)
    {
        if (response?._embedded?.events == null)
            return new List<Event>();

        return response._embedded.events.Select(e => new Event
        {
            Id = e.id ?? string.Empty,
            Name = e.name ?? string.Empty,
            ImageUrl = e.images?.FirstOrDefault()?.url ?? string.Empty,
            Date = e.dates?.start?.dateTime ?? string.Empty,
            VenueName = e._embedded?.venues?.FirstOrDefault()?.name ?? string.Empty,
            City = e._embedded?.venues?.FirstOrDefault()?.city?.name ?? string.Empty,
            Country = e._embedded?.venues?.FirstOrDefault()?.country?.name ?? string.Empty,
            Category = e.classifications?.FirstOrDefault()?.segment?.name ?? string.Empty,
            TicketmasterUrl = e.url ?? string.Empty,
            PriceRange = e.priceRanges?.FirstOrDefault() != null ? new PriceRange
            {
                Min = e.priceRanges.First().min,
                Max = e.priceRanges.First().max,
                Currency = e.priceRanges.First().currency ?? "USD"
            } : null
        }).ToList();
    }

    private EventDetail? MapToEventDetail(TicketmasterEventResponse? response)
    {
        if (response == null) return null;

        var venue = response._embedded?.venues?.FirstOrDefault();

        return new EventDetail
        {
            Id = response.id ?? string.Empty,
            Name = response.name ?? string.Empty,
            ImageUrl = response.images?.FirstOrDefault()?.url ?? string.Empty,
            Date = response.dates?.start?.dateTime ?? string.Empty,
            VenueName = venue?.name ?? string.Empty,
            City = venue?.city?.name ?? string.Empty,
            Country = venue?.country?.name ?? string.Empty,
            Category = response.classifications?.FirstOrDefault()?.segment?.name ?? string.Empty,
            TicketmasterUrl = response.url ?? string.Empty,
            Description = response.info ?? response.pleaseNote,
            VenueAddress = venue?.address?.line1 ?? string.Empty,
            Latitude = double.TryParse(venue?.location?.latitude, out var lat) ? lat : 0,
            Longitude = double.TryParse(venue?.location?.longitude, out var lon) ? lon : 0,
            Promoter = response.promoter?.name,
            PriceRange = response.priceRanges?.FirstOrDefault() != null ? new PriceRange
            {
                Min = response.priceRanges.First().min,
                Max = response.priceRanges.First().max,
                Currency = response.priceRanges.First().currency ?? "USD"
            } : null
        };
    }

    // DTOs for Ticketmaster API response
    private class TicketmasterEventsResponse
    {
        public Embedded? _embedded { get; set; }
        public class Embedded
        {
            public List<TicketmasterEventDto>? events { get; set; }
        }
    }

    private class TicketmasterEventResponse
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public string? url { get; set; }
        public string? info { get; set; }
        public string? pleaseNote { get; set; }
        public List<ImageDto>? images { get; set; }
        public DatesDto? dates { get; set; }
        public List<ClassificationDto>? classifications { get; set; }
        public List<PriceRangeDto>? priceRanges { get; set; }
        public PromoterDto? promoter { get; set; }
        public EmbeddedVenuesDto? _embedded { get; set; }
    }

    private class TicketmasterEventDto
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public string? url { get; set; }
        public List<ImageDto>? images { get; set; }
        public DatesDto? dates { get; set; }
        public List<ClassificationDto>? classifications { get; set; }
        public List<PriceRangeDto>? priceRanges { get; set; }
        public EmbeddedVenuesDto? _embedded { get; set; }
    }

    private class ImageDto
    {
        public string? url { get; set; }
    }

    private class DatesDto
    {
        public StartDto? start { get; set; }
    }

    private class StartDto
    {
        public string? dateTime { get; set; }
    }

    private class ClassificationDto
    {
        public SegmentDto? segment { get; set; }
    }

    private class SegmentDto
    {
        public string? name { get; set; }
    }

    private class PriceRangeDto
    {
        public decimal min { get; set; }
        public decimal max { get; set; }
        public string? currency { get; set; }
    }

    private class PromoterDto
    {
        public string? name { get; set; }
    }

    private class EmbeddedVenuesDto
    {
        public List<VenueDto>? venues { get; set; }
    }

    private class VenueDto
    {
        public string? name { get; set; }
        public CityDto? city { get; set; }
        public CountryDto? country { get; set; }
        public AddressDto? address { get; set; }
        public LocationDto? location { get; set; }
    }

    private class CityDto
    {
        public string? name { get; set; }
    }

    private class CountryDto
    {
        public string? name { get; set; }
    }

    private class AddressDto
    {
        public string? line1 { get; set; }
    }

    private class LocationDto
    {
        public string? latitude { get; set; }
        public string? longitude { get; set; }
    }
}
