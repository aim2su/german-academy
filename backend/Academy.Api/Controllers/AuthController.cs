using Academy.Api.Data;
using Academy.Api.Dtos;
using Academy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Academy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AcademyDbContext _db;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        AcademyDbContext db,
        IConfiguration config,
        ILogger<AuthController> logger)
    {
        _db = db;
        _config = config;
        _logger = logger;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("LoginPolicy")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var admin = await _db.Admins
            .FirstOrDefaultAsync(a => a.Username == request.Username);

        if (admin == null || !admin.IsActive)
        {
            _logger.LogWarning("Login attempt failed for '{Username}'", request.Username);
            return Unauthorized(new { error = "Неверное имя пользователя или пароль" });
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
        {
            _logger.LogWarning("Login attempt failed for '{Username}' (wrong password)", request.Username);
            return Unauthorized(new { error = "Неверное имя пользователя или пароль" });
        }

        var accessToken = GenerateAccessToken(admin, out var accessExpiresAt);
        var refreshToken = await CreateRefreshTokenAsync(admin);

        _logger.LogInformation("Admin '{Username}' logged in successfully", admin.Username);

        return Ok(new LoginResponse
        {
            AccessToken = accessToken,
            AccessTokenExpiresAt = accessExpiresAt,
            RefreshToken = refreshToken.Token,
            RefreshTokenExpiresAt = refreshToken.ExpiresAt,
            Username = admin.Username,
            Role = admin.Role.ToString(),
        });
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    [EnableRateLimiting("RefreshPolicy")]
    public async Task<ActionResult<LoginResponse>> Refresh([FromBody] RefreshRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var oldToken = await _db.RefreshTokens
            .Include(rt => rt.Admin)
            .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

        if (oldToken == null)
        {
            _logger.LogWarning("Refresh attempt with unknown token");
            return Unauthorized(new { error = "Invalid refresh token" });
        }

        if (oldToken.IsRevoked)
        {
            _logger.LogWarning("Refresh attempt with REVOKED token for admin {AdminId}. Revoking all tokens!",
                oldToken.AdminId);

            var allActive = await _db.RefreshTokens
                .Where(rt => rt.AdminId == oldToken.AdminId && rt.RevokedAt == null)
                .ToListAsync();

            foreach (var t in allActive)
                t.RevokedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Unauthorized(new { error = "Токен был отозван. Войдите заново." });
        }

        if (oldToken.IsExpired)
        {
            _logger.LogWarning("Refresh attempt with expired token for admin {AdminId}", oldToken.AdminId);
            return Unauthorized(new { error = "Refresh token expired" });
        }

        if (!oldToken.Admin.IsActive)
        {
            _logger.LogWarning("Refresh attempt for inactive admin {AdminId}", oldToken.AdminId);
            return Unauthorized(new { error = "Вас лишили прав администратора" });
        }

        var newRefresh = await CreateRefreshTokenAsync(oldToken.Admin);

        oldToken.RevokedAt = DateTime.UtcNow;
        oldToken.ReplacedByToken = newRefresh.Token;

        await _db.SaveChangesAsync();

        var newAccessToken = GenerateAccessToken(oldToken.Admin, out var accessExpiresAt);

        _logger.LogInformation("Token refreshed for admin '{Username}'", oldToken.Admin.Username);

        return Ok(new LoginResponse
        {
            AccessToken = newAccessToken,
            AccessTokenExpiresAt = accessExpiresAt,
            RefreshToken = newRefresh.Token,
            RefreshTokenExpiresAt = newRefresh.ExpiresAt,
            Username = oldToken.Admin.Username,
            Role = oldToken.Admin.Role.ToString(),
        });
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout([FromBody] RefreshRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var token = await _db.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

        if (token != null && token.RevokedAt == null)
        {
            token.RevokedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            _logger.LogInformation("Admin {AdminId} logged out", token.AdminId);
        }

        return Ok(new { message = "Logged out" });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<MeResponse>> Me()
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(adminIdClaim, out var adminId))
            return Unauthorized();

        var admin = await _db.Admins.FindAsync(adminId);
        if (admin == null || !admin.IsActive)
            return Unauthorized();

        return Ok(new MeResponse
        {
            Id = admin.Id,
            Username = admin.Username,
            Role = admin.Role.ToString(),
        });
    }

    [HttpPost("change-password")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(adminIdClaim, out var adminId))
            return Unauthorized();

        var admin = await _db.Admins.FindAsync(adminId);
        if (admin == null || !admin.IsActive)
            return Unauthorized();

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, admin.PasswordHash))
        {
            _logger.LogWarning("Change password failed for '{Username}': wrong current password",
                admin.Username);
            return BadRequest(new { error = "Текущий пароль указан неверно" });
        }

        if (request.CurrentPassword == request.NewPassword)
            return BadRequest(new { error = "Новый пароль должен отличаться от старого" });

        admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

        var activeTokens = await _db.RefreshTokens
            .Where(rt => rt.AdminId == adminId && rt.RevokedAt == null)
            .ToListAsync();

        foreach (var t in activeTokens)
            t.RevokedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        _logger.LogInformation("SuperAdmin '{Username}' changed own password. {Count} refresh tokens revoked.",
            admin.Username, activeTokens.Count);

        return Ok(new { message = "Пароль успешно изменен. Войдите в систему снова!" });
    }

    private string GenerateAccessToken(Admin admin, out DateTime expiresAt)
    {
        var secret = _config["Jwt:Secret"]
            ?? throw new InvalidOperationException("Jwt:Secret not configured");
        var issuer = _config["Jwt:Issuer"]
            ?? throw new InvalidOperationException("Jwt:Issuer not configured");
        var audience = _config["Jwt:Audience"]
            ?? throw new InvalidOperationException("Jwt:Audience not configured");
        var minutes = int.Parse(_config["Jwt:AccessTokenMinutes"] ?? "60");

        expiresAt = DateTime.UtcNow.AddMinutes(minutes);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, admin.Id.ToString()),
            new(ClaimTypes.Name, admin.Username),
            new(ClaimTypes.Role, admin.Role.ToString()),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<RefreshToken> CreateRefreshTokenAsync(Admin admin)
    {
        var days = int.Parse(_config["Jwt:RefreshTokenDays"] ?? "7");

        var token = new RefreshToken
        {
            Token = GenerateRandomToken(),
            AdminId = admin.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(days),
            CreatedAt = DateTime.UtcNow,
        };

        _db.RefreshTokens.Add(token);
        await _db.SaveChangesAsync();

        return token;
    }

    private static string GenerateRandomToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}


















//namespace Academy.Api.Controllers;

//using Academy.Api.Data;
//using Academy.Api.Dtos;
//using Academy.Api.Models;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//[ApiController]
//[Route("api/[controller]")]
//public class AuthController : ControllerBase
//{
//    private readonly AcademyDbContext _db;
//    private readonly IConfiguration _config;
//    private readonly ILogger<AuthController> _logger;

//    public AuthController(
//        AcademyDbContext db,
//        IConfiguration config,
//        ILogger<AuthController> logger)
//    {
//        _db = db;
//        _config = config;
//        _logger = logger;
//    }

//    [HttpPost("change-password")]
//    [Authorize(Roles = "SuperAdmin")]
//    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
//    {
//        if (!ModelState.IsValid)
//            return BadRequest(ModelState);

//        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//        if (!int.TryParse(adminIdClaim, out var adminId))
//            return Unauthorized();

//        var admin = await _db.Admins.FindAsync(adminId);
//        if (admin == null || !admin.IsActive)
//            return Unauthorized();

//        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, admin.PasswordHash))
//        {
//            _logger.LogWarning("Change password failed for '{Username}': wrong current password",
//                admin.Username);
//            return BadRequest(new { error = "Current password is incorrect" });
//        }

//        if (request.CurrentPassword == request.NewPassword)
//            return BadRequest(new { error = "New password must be different from current" });

//        admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
//        await _db.SaveChangesAsync();

//        _logger.LogInformation("SuperAdmin '{Username}' changed own password", admin.Username);

//        return Ok(new { message = "Password changed successfully" });
//    }

//    [HttpPost("login")]
//    [AllowAnonymous]
//    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
//    {
//        if (!ModelState.IsValid)
//            return BadRequest(ModelState);

//        var admin = await _db.Admins
//            .FirstOrDefaultAsync(a => a.Username == request.Username);

//        if (admin == null || !admin.IsActive)
//        {
//            _logger.LogWarning("Login attempt failed for '{Username}'", request.Username);
//            return Unauthorized(new { error = "Invalid username or password" });
//        }

//        if (!BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
//        {
//            _logger.LogWarning("Login attempt failed for '{Username}' (wrong password)", request.Username);
//            return Unauthorized(new { error = "Invalid username or password" });
//        }

//        var token = GenerateJwtToken(admin, out var expiresAt);

//        _logger.LogInformation("Admin '{Username}' logged in successfully", admin.Username);

//        return Ok(new LoginResponse
//        {
//            Token = token,
//            ExpiresAt = expiresAt,
//            Username = admin.Username,
//            Role = admin.Role.ToString(),
//        });
//    }

//    // GET: api/auth/me
//    [HttpGet("me")]
//    [Authorize]
//    public async Task<ActionResult<MeResponse>> Me()
//    {
//        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//        if (!int.TryParse(adminIdClaim, out var adminId))
//            return Unauthorized();

//        var admin = await _db.Admins.FindAsync(adminId);
//        if (admin == null || !admin.IsActive)
//            return Unauthorized();

//        return Ok(new MeResponse
//        {
//            Id = admin.Id,
//            Username = admin.Username,
//            Role = admin.Role.ToString(),
//        });
//    }

//    private string GenerateJwtToken(Admin admin, out DateTime expiresAt)
//    {
//        var secret = _config["Jwt:Secret"]
//            ?? throw new InvalidOperationException("Jwt:Secret not configured");
//        var issuer = _config["Jwt:Issuer"]
//            ?? throw new InvalidOperationException("Jwt:Issuer not configured");
//        var audience = _config["Jwt:Audience"]
//            ?? throw new InvalidOperationException("Jwt:Audience not configured");
//        var minutes = int.Parse(_config["Jwt:AccessTokenMinutes"] ?? "60");

//        expiresAt = DateTime.UtcNow.AddMinutes(minutes);

//        var claims = new List<Claim>
//        {
//            new(ClaimTypes.NameIdentifier, admin.Id.ToString()),
//            new(ClaimTypes.Name, admin.Username),
//            new(ClaimTypes.Role, admin.Role.ToString()),
//        };

//        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
//        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//        var token = new JwtSecurityToken(
//            issuer: issuer,
//            audience: audience,
//            claims: claims,
//            expires: expiresAt,
//            signingCredentials: creds);

//        return new JwtSecurityTokenHandler().WriteToken(token);
//    }
//}