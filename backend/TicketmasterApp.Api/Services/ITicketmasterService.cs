using TicketmasterApp.Api.Models;

namespace TicketmasterApp.Api.Services;

public interface ITicketmasterService
{
    Task<List<Event>> SearchEventsAsync(SearchRequest request);
    Task<EventDetail?> GetEventDetailAsync(string eventId);
}
