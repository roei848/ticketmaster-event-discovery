namespace TicketmasterApp.Api.Models;

public class Event
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string VenueName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string TicketmasterUrl { get; set; } = string.Empty;
    public PriceRange? PriceRange { get; set; }
}
