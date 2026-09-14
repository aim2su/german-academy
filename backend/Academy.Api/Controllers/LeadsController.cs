using Academy.Api.Data;
using Academy.Api.Dtos;
using Academy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace Academy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeadsController : ControllerBase
{
    private readonly AcademyDbContext _db;
    private readonly ILogger<LeadsController> _logger;

    public LeadsController(AcademyDbContext db, ILogger<LeadsController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpPost]
    [AllowAnonymous]
    [EnableRateLimiting("LeadsPolicy")]
    public async Task<ActionResult<Lead>> Create([FromBody] Lead lead)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        lead.Name = lead.Name.Trim();
        lead.Phone = lead.Phone.Trim();
        lead.Email = lead.Email?.Trim();
        lead.Level = lead.Level.Trim();
        lead.Comment = lead.Comment?.Trim();

        lead.CreatedAt = DateTime.UtcNow;
        lead.IsProcessed = false;

        _db.Leads.Add(lead);
        await _db.SaveChangesAsync();

        _logger.LogInformation("New lead #{Id} from {Name}, phone {Phone}",
            lead.Id, lead.Name, lead.Phone);

        return CreatedAtAction(nameof(GetById), new { id = lead.Id }, lead);
    }


    [HttpGet]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<PagedResponse<Lead>>> GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var totalCount = await _db.Leads.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var items = await _db.Leads
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new PagedResponse<Lead>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasNext = page < totalPages,
            HasPrevious = page > 1,
        });
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<Lead>> GetById(int id)
    {
        var lead = await _db.Leads.FindAsync(id);

        if (lead == null)
            return NotFound();

        return Ok(lead);
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<Lead>> UpdateStatus(int id, [FromBody] UpdateLeadStatusRequest request)
    {
        var lead = await _db.Leads.FindAsync(id);

        if (lead == null)
            return NotFound();

        lead.IsProcessed = request.IsProcessed;
        await _db.SaveChangesAsync();

        _logger.LogInformation("Lead #{Id} status changed to {IsProcessed}",
            lead.Id, lead.IsProcessed);

        return Ok(lead);
    }
}








// Рабочий вариант, но без авторизации

//using Academy.Api.Data;
//using Academy.Api.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//namespace Academy.Api.Controllers;

//[ApiController]
//[Route("api/[controller]")]
//public class LeadsController : ControllerBase
//{
//    private readonly AcademyDbContext _db;
//    private readonly ILogger<LeadsController> _logger;

//    public LeadsController(AcademyDbContext db, ILogger<LeadsController> logger)
//    {
//        _db = db;
//        _logger = logger;
//    }

//    [HttpPost]
//    public async Task<ActionResult<Lead>> Create([FromBody] Lead lead)
//    {
//        if (!ModelState.IsValid)
//            return BadRequest(ModelState);

//        lead.CreatedAt = DateTime.UtcNow;
//        lead.IsProcessed = false;

//        _db.Leads.Add(lead);
//        await _db.SaveChangesAsync();

//        _logger.LogInformation("New lead #{Id} from {Name}, phone {Phone}",
//            lead.Id, lead.Name, lead.Phone);

//        return CreatedAtAction(nameof(GetById), new { id = lead.Id }, lead);
//    }

//    [HttpGet]
//    public async Task<ActionResult<IEnumerable<Lead>>> GetAll()
//    {
//        var leads = await _db.Leads
//            .OrderByDescending(l => l.CreatedAt)
//            .ToListAsync();

//        return Ok(leads);
//    }

//    [HttpGet("{id:int}")]
//    public async Task<ActionResult<Lead>> GetById(int id)
//    {
//        var lead = await _db.Leads.FindAsync(id);

//        if (lead == null)
//            return NotFound();

//        return Ok(lead);
//    }

//    [HttpPatch("{id:int}/status")]
//    public async Task<ActionResult<Lead>> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
//    {
//        var lead = await _db.Leads.FindAsync(id);

//        if (lead == null)
//            return NotFound();

//        lead.IsProcessed = request.IsProcessed;
//        await _db.SaveChangesAsync();

//        _logger.LogInformation("Lead #{Id} status changed to {IsProcessed}",
//            lead.Id, lead.IsProcessed);

//        return Ok(lead);
//    }
//}

//public class UpdateStatusRequest
//{
//    public bool IsProcessed { get; set; }
//}