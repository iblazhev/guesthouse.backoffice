using GuestHouseBackOffice.Api.Overrides;
using GuestHouseBackOffice.Application;
using GuestHouseBackOffice.Domain.Entities;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
var loggerConfiguration = new LoggerConfiguration()
    .WriteTo.Console();
if (!builder.Environment.IsDevelopment())
    loggerConfiguration.WriteTo.File("log-.txt", rollingInterval: RollingInterval.Day);

Log.Logger = loggerConfiguration
    .CreateLogger();

builder.Host.UseSerilog();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDBContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});


builder.Services.AddApplicationServices();

builder.Services.AddAuthentication().AddBearerToken(IdentityConstants.BearerScheme);
builder.Services.AddAuthorizationBuilder();
builder.Services.AddIdentityCore<MyUser>()
    .AddEntityFrameworkStores<AppDBContext>()
    .AddApiEndpoints();

builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("Application"));

var app = builder.Build();

app.UseSerilogRequestLogging();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

if (!app.Environment.IsDevelopment()) app.UseHttpsRedirection();

//exclude register user for production
if (!app.Environment.IsDevelopment())
{
    app.MapIdentityApiFilterable<MyUser>(new IdentityApiEndpointRouteBuilderOptions
    {
        ExcludeAllExceptLogin = true
    });
}
else
{
    app.UseAuthorization();
    app.MapIdentityApi<MyUser>();
}

app.MapControllers();
if (app.Environment.IsDevelopment()) app.MapOpenApi();
app.Run();

public class AppSettings
{
    public string Version { get; set; } = string.Empty;
}