using GuestHouseBackOffice.Application.Payments.Commands;
using GuestHouseBackOffice.Application.Payments.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GuestHouseBackOffice.Api.Controllers;

[ApiController]
[Route("payments")]
public class PaymentsController(ISender mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetPayments()
    {
        var result = await mediator.Send(new GetPaymentsQuery());
        return Ok(result);
    }

    [HttpGet]
    [Route("summary")]
    public async Task<ActionResult> GetPaymentsSummary()
    {
        var result = await mediator.Send(new GetPaymentSummaryQuery());
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CreatePaymentResultModel>> CreatePayment([FromBody] CreatePaymentCommand command)
    {
        var result = await mediator.Send(command);
        return Ok(result);
    }
}