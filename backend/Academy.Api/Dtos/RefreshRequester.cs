using System.ComponentModel.DataAnnotations;

namespace Academy.Api.Dtos;

public class RefreshRequest
{
    [Required]
    [MaxLength(200)]
    public string RefreshToken { get; set; } = string.Empty;
}