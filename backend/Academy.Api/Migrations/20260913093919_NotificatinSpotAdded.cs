using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Academy.Api.Migrations
{
    /// <inheritdoc />
    public partial class NotificatinSpotAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "NotifiedAt",
                table: "Leads",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotifiedAt",
                table: "Leads");
        }
    }
}
