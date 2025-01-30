namespace GuestHouseBackOffice.Application.Requests.Models;

public class RequestModel
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int PeopleCount { get; set; }
    public int AdultsCount { get; set; }
    public int KidsCount { get; set; }
    public string City { get; set; }
    public string Comments { get; set; } = null!;
    public bool Approved { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Id { get; set; }
}