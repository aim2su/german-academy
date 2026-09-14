using System.ComponentModel.DataAnnotations;

namespace Academy.Api.Models;

public class RefreshToken
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Token { get; set; } = string.Empty;

    public int AdminId { get; set; }
    public Admin Admin { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? RevokedAt { get; set; }

    [MaxLength(200)]
    public string? ReplacedByToken { get; set; }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsRevoked => RevokedAt != null;
    public bool IsActive => !IsRevoked && !IsExpired;
}