using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PCConfig.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddChipsetAndRamSlots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Chipset",
                table: "Components",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RamSlots",
                table: "Components",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Chipset",
                table: "Components");

            migrationBuilder.DropColumn(
                name: "RamSlots",
                table: "Components");
        }
    }
}
