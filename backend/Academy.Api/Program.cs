using Academy.Api.Data;
using Academy.Api.Enums;
using Academy.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AcademyDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://tojikon-olmon.site",
                "https://www.tojikon-olmon.site",
                "https://german-academy-gamma.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException("Jwt:Secret not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("Jwt:Issuer not configured");
var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("Jwt:Audience not configured");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSecret)),
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();

var bannedLeadIps = new Dictionary<string, DateTime>();
var leadViolations = new Dictionary<string, List<DateTime>>();
var bannedLoginIps = new Dictionary<string, DateTime>();
var loginViolations = new Dictionary<string, List<DateTime>>();
var banLock = new object();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("LoginPolicy", httpContext =>
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        lock (banLock)
        {
            if (bannedLoginIps.TryGetValue(ip, out var banUntil) && banUntil > DateTime.UtcNow)
                return RateLimitPartition.GetNoLimiter("banned-login");

            if (bannedLoginIps.ContainsKey(ip))
            {
                bannedLoginIps.Remove(ip);
                loginViolations.Remove(ip);
            }
        }

        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: ip,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            });
    });

    options.AddPolicy("RefreshPolicy", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 20,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            }));

    options.AddPolicy("LeadsPolicy", httpContext =>
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        lock (banLock)
        {
            if (bannedLeadIps.TryGetValue(ip, out var banUntil) && banUntil > DateTime.UtcNow)
                return RateLimitPartition.GetNoLimiter("banned-lead");

            if (bannedLeadIps.ContainsKey(ip))
            {
                bannedLeadIps.Remove(ip);
                leadViolations.Remove(ip);
            }
        }

        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: ip,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromHours(1),
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            });
    });

    options.OnRejected = async (context, cancellationToken) =>
    {
        var ip = context.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var path = context.HttpContext.Request.Path.Value ?? "";
        var isLogin = path.Contains("/auth/login", StringComparison.OrdinalIgnoreCase);

        bool isBanned = false;

        lock (banLock)
        {
            if (isLogin)
            {
                isBanned = bannedLoginIps.TryGetValue(ip, out var banUntil) && banUntil > DateTime.UtcNow;

                if (!isBanned)
                {
                    if (!loginViolations.ContainsKey(ip))
                        loginViolations[ip] = new List<DateTime>();

                    loginViolations[ip].Add(DateTime.UtcNow);

                    var recent = loginViolations[ip]
                        .Count(v => v > DateTime.UtcNow.AddMinutes(-10));

                    if (recent >= 3)
                    {
                        bannedLoginIps[ip] = DateTime.UtcNow.AddHours(72);
                        isBanned = true;
                    }
                }
            }
            else
            {
                isBanned = bannedLeadIps.TryGetValue(ip, out var banUntil) && banUntil > DateTime.UtcNow;

                if (!isBanned)
                {
                    if (!leadViolations.ContainsKey(ip))
                        leadViolations[ip] = new List<DateTime>();

                    leadViolations[ip].Add(DateTime.UtcNow);

                    var recent = leadViolations[ip]
                        .Count(v => v > DateTime.UtcNow.AddMinutes(-5));

                    if (recent >= 2)
                    {
                        bannedLeadIps[ip] = DateTime.UtcNow.AddHours(24);
                        isBanned = true;
                    }
                }
            }
        }

        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json";

        if (isLogin && isBanned)
        {
            context.HttpContext.Response.Headers["Retry-After"] = "259200";
            await context.HttpContext.Response.WriteAsync(
                "{\"error\":\"Слишком много неверных попыток. Доступ к панели заблокирован на 72 часа.\"}",
                cancellationToken);
        }
        else if (isLogin)
        {
            context.HttpContext.Response.Headers["Retry-After"] = "60";
            await context.HttpContext.Response.WriteAsync(
                "{\"error\":\"Слишком много неверных попыток. Повторите через минуту.\"}",
                cancellationToken);
        }
        else if (isBanned)
        {
            context.HttpContext.Response.Headers["Retry-After"] = "86400";
            await context.HttpContext.Response.WriteAsync(
                "{\"error\":\"Слишком много нарушений. Доступ заблокирован на 24 часа.\"}",
                cancellationToken);
        }
        else
        {
            context.HttpContext.Response.Headers["Retry-After"] = "3600";
            await context.HttpContext.Response.WriteAsync(
                "{\"error\":\"Слишком много запросов. Повторите попытку позже.\"}",
                cancellationToken);
        }
    };
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AcademyDbContext>();
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    await db.Database.MigrateAsync();

    if (!await db.Admins.AnyAsync())
    {
        var username = config["SuperAdmin:Username"]
            ?? throw new InvalidOperationException("SuperAdmin:Username not configured");
        var password = config["SuperAdmin:Password"]
            ?? throw new InvalidOperationException("SuperAdmin:Password not configured");

        var superAdmin = new Admin
        {
            Username = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = AdminRole.SuperAdmin,
            CreatedAt = DateTime.UtcNow,
            IsActive = true,
        };

        db.Admins.Add(superAdmin);
        await db.SaveChangesAsync();

        logger.LogWarning(
            "SuperAdmin '{Username}' created. CHANGE PASSWORD IMMEDIATELY after first login!",
            username);
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Frontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();



//using System.Text;
//using System.Threading.RateLimiting;
//using Academy.Api.Data;
//using Academy.Api.Enums;
//using Academy.Api.Models;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.AspNetCore.RateLimiting;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;

//var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddDbContext<AcademyDbContext>(options =>
//    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("Frontend", policy =>
//    {
//        policy
//            .WithOrigins(
//                "http://localhost:5173",
//                "https://tojikon-olmon.site",
//                "https://www.tojikon-olmon.site",
//                "https://german-academy-gamma.vercel.app"
//            )
//            .AllowAnyHeader()
//            .AllowAnyMethod();
//    });
//});

//var jwtSecret = builder.Configuration["Jwt:Secret"]
//    ?? throw new InvalidOperationException("Jwt:Secret not configured");
//var jwtIssuer = builder.Configuration["Jwt:Issuer"]
//    ?? throw new InvalidOperationException("Jwt:Issuer not configured");
//var jwtAudience = builder.Configuration["Jwt:Audience"]
//    ?? throw new InvalidOperationException("Jwt:Audience not configured");

//builder.Services
//    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            ValidIssuer = jwtIssuer,
//            ValidAudience = jwtAudience,
//            IssuerSigningKey = new SymmetricSecurityKey(
//                Encoding.UTF8.GetBytes(jwtSecret)),
//            ClockSkew = TimeSpan.Zero,
//        };
//    });

//builder.Services.AddAuthorization();

//builder.Services.AddRateLimiter(options =>
//{
//    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

//    options.AddPolicy("LoginPolicy", httpContext =>
//        RateLimitPartition.GetFixedWindowLimiter(
//            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
//            factory: _ => new FixedWindowRateLimiterOptions
//            {
//                PermitLimit = 5,
//                Window = TimeSpan.FromMinutes(1),
//                QueueLimit = 0,
//                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
//            }));

//    options.AddPolicy("RefreshPolicy", httpContext =>
//        RateLimitPartition.GetFixedWindowLimiter(
//            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
//            factory: _ => new FixedWindowRateLimiterOptions
//            {
//                PermitLimit = 20,
//                Window = TimeSpan.FromMinutes(1),
//                QueueLimit = 0,
//                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
//            }));

//    options.OnRejected = async (context, cancellationToken) =>
//    {
//        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
//        context.HttpContext.Response.Headers["Retry-After"] = "60";
//        context.HttpContext.Response.ContentType = "application/json";

//        await context.HttpContext.Response.WriteAsync(
//            "{\"error\":\"Слишком много попыток. Попробуйте снова через 1 минуту.\"}",
//            cancellationToken);
//    };
//});

//var app = builder.Build();

//using (var scope = app.Services.CreateScope())
//{
//    var db = scope.ServiceProvider.GetRequiredService<AcademyDbContext>();
//    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
//    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

//    await db.Database.MigrateAsync();

//    if (!await db.Admins.AnyAsync())
//    {
//        var username = config["SuperAdmin:Username"]
//            ?? throw new InvalidOperationException("SuperAdmin: имя пользователя не установлено");
//        var password = config["SuperAdmin:Password"]
//            ?? throw new InvalidOperationException("SuperAdmin: пароль не установлен");

//        var superAdmin = new Admin
//        {
//            Username = username,
//            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
//            Role = AdminRole.SuperAdmin,
//            CreatedAt = DateTime.UtcNow,
//            IsActive = true,
//        };

//        db.Admins.Add(superAdmin);
//        await db.SaveChangesAsync();

//        logger.LogWarning(
//            "SuperAdmin '{Username}' created. CHANGE PASSWORD IMMEDIATELY after first login!",
//            username);
//    }
//}

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseCors("Frontend");

//app.UseRateLimiter();

//app.UseAuthentication();
//app.UseAuthorization();
//app.MapControllers();

//app.Run();