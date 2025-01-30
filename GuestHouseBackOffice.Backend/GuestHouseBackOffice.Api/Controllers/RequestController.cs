using GuestHouseBackOffice.Application.Requests.Commands;
using GuestHouseBackOffice.Application.Requests.Models;
using GuestHouseBackOffice.Application.Requests.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GuestHouseBackOffice.Api.Controllers;

[ApiController]
[Route("requests")]
public class RequestController(ISender mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IList<RequestModel>>> GetList()
    {
        var result = await mediator.Send(new GetRequestsQuery());
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CreateRequestResultModel>> ApplyRequest([FromBody] CreateRequestCommand command)
    {
        var result = await mediator.Send(command);
        return result;
    }
}