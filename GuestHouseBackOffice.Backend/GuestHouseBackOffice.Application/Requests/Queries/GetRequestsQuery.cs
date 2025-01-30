using GuestHouseBackOffice.Application.Requests.Models;
using MediatR;

namespace GuestHouseBackOffice.Application.Requests.Queries;

public class GetRequestsQuery : IRequest<IList<RequestModel>>
{
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
        var requests = context.Requests.Select(x => new RequestModel
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
        }).ToList();
        return requests;
    }
}