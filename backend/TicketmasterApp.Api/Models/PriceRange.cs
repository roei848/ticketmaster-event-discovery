namespace TicketmasterApp.Api.Models;

public class PriceRange
{
    public decimal Min { get; set; }
    public decimal Max { get; set; }
    public string Currency { get; set; } = "USD";
}
