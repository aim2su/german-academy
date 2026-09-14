using System.ComponentModel.DataAnnotations;

namespace Academy.Api.Models;

public class Lead
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    [Required]
    [MaxLength(30)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(150)]
    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    [MaxLength(20)]
    public string Level { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsProcessed { get; set; } = false;
    public DateTime? NotifiedAt { get; set; }
}