using GuestHouseBackOffice.Application.Requests.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GuestHouseBackOffice.Application.Requests.Queries;

public class GetRequestsQuery : IRequest<IList<RequestModel>>
{
    // Optional date range to filter by reservation period overlap
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}

public class GetRequestsQueryHandler : IRequestHandler<GetRequestsQuery, IList<RequestModel>>
{
    private readonly AppDBContext context;

    public GetRequestsQueryHandler(AppDBContext context)
    {
        this.context = context;
    }

    public async Task<IList<RequestModel>> Handle(GetRequestsQuery request, CancellationToken cancellationToken)
    {
        var query = context.Requests.AsQueryable();

        // Overlap logic:
        // - When both From and To are provided, return requests where [StartDate, EndDate] overlaps [From, To].
        // - When only From is provided, return requests that end on/after From.
        // - When only To is provided, return requests that start on/before To.
        if (request.From.HasValue && request.To.HasValue)
        {
            var from = request.From.Value;
            var to = request.To.Value;
            query = query.Where(x => x.EndDate >= from && x.StartDate <= to);
        }
        else if (request.From.HasValue)
        {
            var from = request.From.Value;
            query = query.Where(x => x.EndDate >= from);
        }
        else if (request.To.HasValue)
        {
            var to = request.To.Value;
            query = query.Where(x => x.StartDate <= to);
        }

        var requests = await query.Select(x => new RequestModel
        {
            Id = x.Id,
            Name = x.Name,
            Email = x.Email,
            Phone = x.Phone,
            StartDate = x.StartDate,
            EndDate = x.EndDate,
            ApprovedAt = x.ApprovedAt,
            Approved = x.Approved,
            PeopleCount = x.PeopleCount,
            Comments = x.Comments,
            AdultsCount = x.AdultsCount,
            CreatedAt = x.CreatedAt,
            KidsCount = x.KidsCount,
            City = x.City
        }).ToListAsync(cancellationToken);
        return requests;
    }
}