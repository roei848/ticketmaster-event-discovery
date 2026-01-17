using Microsoft.AspNetCore.Mvc;
using TicketmasterApp.Api.Models;
using TicketmasterApp.Api.Services;

namespace TicketmasterApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly ITicketmasterService _ticketmasterService;
    private readonly ICacheService _cacheService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<EventsController> _logger;

    public EventsController(
        ITicketmasterService ticketmasterService,
        ICacheService cacheService,
        IConfiguration configuration,
        ILogger<EventsController> logger)
    {
        _ticketmasterService = ticketmasterService;
        _cacheService = cacheService;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<Event>>> Search(
        [FromQuery] string city,
        [FromQuery] int radius,
        [FromQuery] double latitude,
        [FromQuery] double longitude,
        [FromQuery] List<string>? eventTypes = null,
        [FromQuery] string? startDate = null,
        [FromQuery] string? endDate = null)
    {
        if (string.IsNullOrWhiteSpace(city))
            return BadRequest("City is required");

        if (radius < 5 || radius > 200)
            return BadRequest("Radius must be between 5 and 200 miles");

        var searchRequest = new SearchRequest
        {
            City = city,
            Radius = radius,
            Latitude = latitude,
            Longitude = longitude,
            EventTypes = eventTypes ?? new List<string>(),
            StartDate = startDate,
            EndDate = endDate
        };

        // Check cache
        var cacheKey = _cacheService.GenerateSearchKey(city, radius, searchRequest.EventTypes, startDate, endDate);
        var cachedEvents = _cacheService.Get<List<Event>>(cacheKey);

        if (cachedEvents != null)
        {
            _logger.LogInformation("Returning cached results for {CacheKey}", cacheKey);
            return Ok(cachedEvents);
        }

        // Fetch from API
        var events = await _ticketmasterService.SearchEventsAsync(searchRequest);

        // Cache results
        var ttl = TimeSpan.FromMinutes(_configuration.GetValue<int>("Cache:SearchResultsTtlMinutes"));
        _cacheService.Set(cacheKey, events, ttl);

        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDetail>> GetEventDetail(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            return BadRequest("Event ID is required");

        // Check cache
        var cacheKey = $"event_{id}";
        var cachedEvent = _cacheService.Get<EventDetail>(cacheKey);

        if (cachedEvent != null)
        {
            _logger.LogInformation("Returning cached event detail for {EventId}", id);
            return Ok(cachedEvent);
        }

        // Fetch from API
        var eventDetail = await _ticketmasterService.GetEventDetailAsync(id);

        if (eventDetail == null)
            return NotFound();

        // Cache result
        var ttl = TimeSpan.FromMinutes(_configuration.GetValue<int>("Cache:EventDetailTtlMinutes"));
        _cacheService.Set(cacheKey, eventDetail, ttl);

        return Ok(eventDetail);
    }
}
