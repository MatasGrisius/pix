using Microsoft.EntityFrameworkCore.Migrations;

namespace pix.Migrations
{
    public partial class add : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TagCounters_Users_UsersId",
                table: "TagCounters");

            migrationBuilder.DropIndex(
                name: "IX_TagCounters_UsersId",
                table: "TagCounters");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UsersId",
                table: "TagCounters");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "TagCounters",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Tag",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Pictures",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TagCounters_UserId",
                table: "TagCounters",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TagCounters_Users_UserId",
                table: "TagCounters",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TagCounters_Users_UserId",
                table: "TagCounters");

            migrationBuilder.DropIndex(
                name: "IX_TagCounters_UserId",
                table: "TagCounters");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TagCounters");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsersId",
                table: "TagCounters",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Tag",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Pictures",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.CreateIndex(
                name: "IX_TagCounters_UsersId",
                table: "TagCounters",
                column: "UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_TagCounters_Users_UsersId",
                table: "TagCounters",
                column: "UsersId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
