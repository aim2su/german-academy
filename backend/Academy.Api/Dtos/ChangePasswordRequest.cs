using System.ComponentModel.DataAnnotations;

namespace Academy.Api.Dtos;

public class ChangePasswordRequest
{
    [Required]
    [MaxLength(100)]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [MaxLength(100)]
    public string NewPassword { get; set; } = string.Empty;
}