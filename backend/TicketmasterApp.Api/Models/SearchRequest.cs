using System.ComponentModel.DataAnnotations;

namespace TicketmasterApp.Api.Models;

public class SearchRequest
{
    [Required]
    public string City { get; set; } = string.Empty;

    [Required]
    [Range(5, 200)]
    public int Radius { get; set; }

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public List<string> EventTypes { get; set; } = new();

    public string? StartDate { get; set; }

    public string? EndDate { get; set; }
}
