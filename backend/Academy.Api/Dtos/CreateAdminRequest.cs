using System.ComponentModel.DataAnnotations;

namespace Academy.Api.Dtos;

public class CreateAdminRequest
{
    [Required]
    [MinLength(3)]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [MaxLength(100)]
    public string Password { get; set; } = string.Empty;

    //public bool IsSuperAdmin { get; set; } = false;
}