using System.Text;
using Academy.Api.Models;
using System.Text.Json;

namespace Academy.Bot.Services;

public class TelegramNotifier
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;
    private readonly ILogger<TelegramNotifier> _logger;

    public TelegramNotifier(
        HttpClient http,
        IConfiguration config,
        ILogger<TelegramNotifier> logger)
    {
        _http = http;
        _config = config;
        _logger = logger;
    }

    public async Task<bool> SendLeadNotificationAsync(Lead lead, CancellationToken ct = default)
    {
        var token = _config["Telegram:BotToken"];
        var chatId = _config["Telegram:ChatId"];

        if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(chatId))
        {
            _logger.LogWarning("Telegram token or chatId not configured. Skipping notification.");
            return false;
        }

        var text = FormatLeadMessage(lead);
        var url = $"https://api.telegram.org/bot{token}/sendMessage";

        var payload = new Dictionary<string, object>
        {
            ["chat_id"] = chatId,
            ["text"] = text,
            ["parse_mode"] = "HTML",
            ["disable_web_page_preview"] = true,
        };
        var topicId = _config["Telegram:TopicId"];
        if (!string.IsNullOrWhiteSpace(topicId) && int.TryParse(topicId, out var topicInt))
        {
            payload["message_thread_id"] = topicInt;
        }

        try
        {
            var json = JsonSerializer.Serialize(payload);
            using var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _http.PostAsync(url, content, ct);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError(
                    "Telegram API error {StatusCode} for lead #{LeadId}: {Error}",
                    (int)response.StatusCode, lead.Id, error);
                return false;
            }

            _logger.LogInformation("Telegram notification sent for lead #{LeadId}", lead.Id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send Telegram notification for lead #{LeadId}", lead.Id);
            return false;
        }
    }

    private static string FormatLeadMessage(Lead lead)
    {
        var sb = new StringBuilder();
        sb.AppendLine("📥 <b>Новая заявка!</b>");
        sb.AppendLine();
        sb.AppendLine($"👤 <b>Имя:</b> {Escape(lead.Name)}");
        sb.AppendLine($"📞 <b>Телефон:</b> {Escape(lead.Phone)}");

        if (!string.IsNullOrWhiteSpace(lead.Email))
            sb.AppendLine($"📧 <b>Email:</b> {Escape(lead.Email)}");

        sb.AppendLine($"📚 <b>Уровень:</b> {Escape(lead.Level)}");

        if (!string.IsNullOrWhiteSpace(lead.Comment))
            sb.AppendLine($"💬 <b>Комментарий:</b> {Escape(lead.Comment)}");

        sb.AppendLine();
        //sb.AppendLine($"🕐 {lead.CreatedAt:dd.MM.yyyy HH:mm} UTC");
        var localTime = lead.CreatedAt.AddHours(5);
        sb.AppendLine($"🕐 {localTime:dd.MM.yyyy HH:mm} (Душанбе)");
        sb.AppendLine($"🆔 Заявка #{lead.Id}");

        return sb.ToString();
    }

    private static string Escape(string? text)
    {
        if (string.IsNullOrEmpty(text)) return "—";
        return text
            .Replace("&", "&amp;")
            .Replace("<", "&lt;")
            .Replace(">", "&gt;");
    }
}