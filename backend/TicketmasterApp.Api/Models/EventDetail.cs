namespace TicketmasterApp.Api.Models;

public class EventDetail : Event
{
    public string? Description { get; set; }
    public string VenueAddress { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Promoter { get; set; }
}
