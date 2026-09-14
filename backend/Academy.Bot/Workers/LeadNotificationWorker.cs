using Academy.Api.Data;
using Academy.Bot.Services;
using Microsoft.EntityFrameworkCore;
namespace Academy.Bot.Workers;

public class LeadNotificationWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IConfiguration _config;
    private readonly ILogger<LeadNotificationWorker> _logger;
    private readonly int _intervalSeconds;

    public LeadNotificationWorker(
        IServiceScopeFactory scopeFactory,
        IConfiguration config,
        ILogger<LeadNotificationWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _config = config;
        _logger = logger;
        _intervalSeconds = int.TryParse(config["Worker:PollIntervalSeconds"], out var s) ? s : 30;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            "LeadNotificationWorker started. Polling every {Interval} seconds.",
            _intervalSeconds);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessNewLeadsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during lead processing cycle");
            }

            try
            {
                await Task.Delay(TimeSpan.FromSeconds(_intervalSeconds), stoppingToken);
            }
            catch (TaskCanceledException)
            {
                break;
            }
        }

        _logger.LogInformation("LeadNotificationWorker stopped.");
    }

    private async Task ProcessNewLeadsAsync(CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AcademyDbContext>();
        var notifier = scope.ServiceProvider.GetRequiredService<TelegramNotifier>();

        var pending = await db.Leads
            .Where(l => l.NotifiedAt == null)
            .OrderBy(l => l.CreatedAt)
            .Take(20)
            .ToListAsync(ct);

        if (pending.Count == 0) return;

        _logger.LogInformation("Found {Count} pending leads", pending.Count);

        foreach (var lead in pending)
        {
            var sent = await notifier.SendLeadNotificationAsync(lead, ct);

            if (sent)
            {
                lead.NotifiedAt = DateTime.UtcNow;
            }
            else
            {
                _logger.LogWarning(
                    "Notification failed for lead #{LeadId}. Will retry next cycle.",
                    lead.Id);
            }
        }

        await db.SaveChangesAsync(ct);
    }
}