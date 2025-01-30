using guesthouse.server.Application.Payments.Models;
using MediatR;

namespace GuestHouseBackOffice.Application.Payments.Queries;

public class GetPaymentSummaryQuery : IRequest<PaymentSummaryModel>
{
}

public class GetPaymentSummaryQueryHandler : IRequestHandler<GetPaymentSummaryQuery, PaymentSummaryModel>
{
    private readonly AppDBContext _context;

    public GetPaymentSummaryQueryHandler(AppDBContext context)
    {
        _context = context;
    }

    public async Task<PaymentSummaryModel> Handle(GetPaymentSummaryQuery request, CancellationToken cancellationToken)
    {
        var income = _context.Payments.Where(p => !p.IsExpense).Sum(p => p.Amount);
        var expense = _context.Payments.Where(p => p.IsExpense).Sum(p => p.Amount);
        var result = new PaymentSummaryModel
        {
            Income = income,
            Expenses = expense
        };
        return result;
    }
}