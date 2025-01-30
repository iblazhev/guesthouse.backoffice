using GuestHouseBackOffice.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AppDBContext : IdentityDbContext<MyUser>
{
    public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
    {
    }

    public AppDBContext()
    {
    }

    public DbSet<Request> Requests { get; set; }
    public DbSet<Payment> Payments { get; set; }
}