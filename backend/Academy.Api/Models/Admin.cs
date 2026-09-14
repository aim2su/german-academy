using Academy.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace Academy.Api.Models;

public class Admin
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public AdminRole Role { get; set; } = AdminRole.Admin;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}