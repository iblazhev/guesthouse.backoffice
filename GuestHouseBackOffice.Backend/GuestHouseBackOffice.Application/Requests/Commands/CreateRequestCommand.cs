using GuestHouseBackOffice.Application.Requests.Models;
using GuestHouseBackOffice.Domain.Entities;
using MediatR;

namespace GuestHouseBackOffice.Application.Requests.Commands;

public class CreateRequestHandler : IRequestHandler<CreateRequestCommand, CreateRequestResultModel>
{
    private readonly AppDBContext context;

    public CreateRequestHandler(AppDBContext context)
    {
        this.context = context;
    }

    public async Task<CreateRequestResultModel> Handle(CreateRequestCommand request,
        CancellationToken cancellationToken)
    {
        var entity = new Request
        {
            Name = request.Name,
            Phone = request.Phone,
            Email = request.Email,
            PeopleCount = request.PeopleCount,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Comments = request.Comments,
            AdultsCount = request.AdultsCount,
            Approved = false,
            ApprovedAt = null,
            CreatedAt = DateTime.UtcNow,
            KidsCount = request.KidsCount,
            City = request.City
        };

        context.Requests.Add(entity);

        await context.SaveChangesAsync(cancellationToken);

        return new CreateRequestResultModel();
    }
}

public class CreateRequestResultModel
{
}

public class CreateRequestCommand : RequestModel, IRequest<CreateRequestResultModel>
{
}