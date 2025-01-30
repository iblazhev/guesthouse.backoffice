using MediatR;

namespace GuestHouseBackOffice.Application.Payments.Queries;

public class GetPaymentsQuery : IRequest<List<PaymentModel>>
{
}

public class GetPaymentsQueryHandler : IRequestHandler<GetPaymentsQuery, List<PaymentModel>>
{
    private readonly AppDBContext context;

    public GetPaymentsQueryHandler(AppDBContext context)
    {
        this.context = context;
    }

    public async Task<List<PaymentModel>> Handle(GetPaymentsQuery request, CancellationToken cancellationToken)
    {
        var payments = context.Payments.Select(x => new PaymentModel
        {
            Id = x.Id,
            Name = x.Name,
            Amount = x.Amount,
            IsExpense = x.IsExpense,
            Comments = x.Comments,
            CreatedAt = x.CreatedAt
        }).ToList();
        return payments;
    }
}