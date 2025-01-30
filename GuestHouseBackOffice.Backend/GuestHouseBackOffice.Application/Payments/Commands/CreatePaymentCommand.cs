using GuestHouseBackOffice.Domain.Entities;
using MediatR;

namespace GuestHouseBackOffice.Application.Payments.Commands;

public class CreatePaymentHandler(AppDBContext context)
    : IRequestHandler<CreatePaymentCommand, CreatePaymentResultModel>
{
    public async Task<CreatePaymentResultModel> Handle(CreatePaymentCommand request,
        CancellationToken cancellationToken)
    {
        var entity = new Payment
        {
            Name = request.Name,
            Amount = request.Amount,
            Comments = request.Comments,
            IsExpense = request.IsExpense,
            CreatedAt = DateTime.UtcNow
        };

        context.Payments.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        return new CreatePaymentResultModel();
    }
}

public class CreatePaymentResultModel
{
}

public class CreatePaymentCommand : PaymentModel, IRequest<CreatePaymentResultModel>
{
}