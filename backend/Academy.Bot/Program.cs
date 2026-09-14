using Academy.Api.Data;
using Academy.Bot.Services;
using Academy.Bot.Workers;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile("appsettings.Development.json", optional: true);

builder.Services.AddDbContext<AcademyDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient<TelegramNotifier>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(15);
});

builder.Services.AddHostedService<LeadNotificationWorker>();

var host = builder.Build();
await host.RunAsync();