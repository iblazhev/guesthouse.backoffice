using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuestHouseBackOffice.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RequestsChangeContryToCity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Country",
                table: "Requests",
                newName: "City");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "City",
                table: "Requests",
                newName: "Country");
        }
    }
}
