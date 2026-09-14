using System.Security.Claims;
using Academy.Api.Data;
using Academy.Api.Dtos;
using Academy.Api.Enums;
using Academy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SuperAdmin")]
public class AdminsController : ControllerBase
{
    private readonly AcademyDbContext _db;
    private readonly ILogger<AdminsController> _logger;

    public AdminsController(AcademyDbContext db, ILogger<AdminsController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminResponse>>> GetAll()
    {
        var admins = await _db.Admins
            .OrderBy(a => a.CreatedAt)
            .Select(a => new AdminResponse
            {
                Id = a.Id,
                Username = a.Username,
                Role = a.Role.ToString(),
                CreatedAt = a.CreatedAt,
                IsActive = a.IsActive,
            })
            .ToListAsync();

        return Ok(admins);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AdminResponse>> GetById(int id)
    {
        var admin = await _db.Admins.FindAsync(id);

        if (admin == null)
            return NotFound();

        return Ok(new AdminResponse
        {
            Id = admin.Id,
            Username = admin.Username,
            Role = admin.Role.ToString(),
            CreatedAt = admin.CreatedAt,
            IsActive = admin.IsActive,
        });
    }

    [HttpPost]
    public async Task<ActionResult<AdminResponse>> Create([FromBody] CreateAdminRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var username = request.Username.Trim();

        if (await _db.Admins.AnyAsync(a => a.Username == username))
            return Conflict(new { error = $"Имя пользователя '{username}' уже занято" });

        var admin = new Admin
        {
            Username = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = AdminRole.Admin,
            CreatedAt = DateTime.UtcNow,
            IsActive = true,
        };

        _db.Admins.Add(admin);
        await _db.SaveChangesAsync();

        _logger.LogInformation("SuperAdmin created new Admin '{Username}' (Id={Id})",
            admin.Username, admin.Id);

        return CreatedAtAction(nameof(GetById), new { id = admin.Id }, new AdminResponse
        {
            Id = admin.Id,
            Username = admin.Username,
            Role = admin.Role.ToString(),
            CreatedAt = admin.CreatedAt,
            IsActive = admin.IsActive,
        });
    }

    [HttpPatch("{id:int}/toggle-active")]
    public async Task<ActionResult<AdminResponse>> ToggleActive(int id)
    {
        var admin = await _db.Admins.FindAsync(id);
        if (admin == null)
            return NotFound();

        if (admin.Role == AdminRole.SuperAdmin)
            return BadRequest(new { error = "Невозможно лишить прав Суперадминистратора." });

        admin.IsActive = !admin.IsActive;
        await _db.SaveChangesAsync();

        _logger.LogInformation("Admin '{Username}' (Id={Id}) active status changed to {IsActive}",
            admin.Username, admin.Id, admin.IsActive);

        return Ok(new AdminResponse
        {
            Id = admin.Id,
            Username = admin.Username,
            Role = admin.Role.ToString(),
            CreatedAt = admin.CreatedAt,
            IsActive = admin.IsActive,
        });
    }

    // API allows only to diactivate admins
    //[HttpDelete("{id:int}")]
    //public async Task<IActionResult> Delete(int id)
    //{
    //    var admin = await _db.Admins.FindAsync(id);
    //    if (admin == null)
    //        return NotFound();

    //    if (admin.Role == AdminRole.SuperAdmin)
    //        return BadRequest(new { error = "SuperAdmin cannot be deleted via API. Delete manually in DB." });

    //    _db.Admins.Remove(admin);
    //    await _db.SaveChangesAsync();

    //    _logger.LogWarning("SuperAdmin deleted Admin '{Username}' (Id={Id})",
    //        admin.Username, admin.Id);

    //    return NoContent();
    //}
}