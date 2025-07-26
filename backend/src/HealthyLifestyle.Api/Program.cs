using DotNetEnv;
using HealthyLifestyle.Application.Interfaces;
using HealthyLifestyle.Application.Mappings;
using HealthyLifestyle.Application.Services;
using HealthyLifestyle.Application.Services.Shop;
using HealthyLifestyle.Core.Entities;
using HealthyLifestyle.Core.Interfaces;
using HealthyLifestyle.Infrastructure.Data;
using HealthyLifestyle.Infrastructure.Repositories;
using HealthyLifestyle.Infrastructure.UnitOfWork;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;


// Создаем билдер для веб-приложения
var builder = WebApplication.CreateBuilder(args);

// Добавляем логирование в консоль
builder.Services.AddLogging(configure => configure.AddConsole());

// Загружаем .env файл
Env.Load("../../.env"); 


// --- Регистрация сервисов в DI контейнере ---

// 1. Настройка DbContext с подключением к SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");
    }
    options.UseSqlServer(connectionString);
});

// 2. Конфигурация Identity с кастомным User и Role<Guid>
builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
{
    // Настройки политики паролей
    options.Password.RequireDigit = true; // Требуется наличие хотя бы одной цифры в пароле (0-9)
    options.Password.RequiredLength = 8; // Минимальная длина пароля — 8 символов
    options.Password.RequireNonAlphanumeric = false; // Не требуется наличие специальных символов (например, !, @, #)
    options.Password.RequireUppercase = true; // Требуется наличие хотя бы одной заглавной буквы (A-Z)
    options.Password.RequireLowercase = true; // Требуется наличие хотя бы одной строчной буквы (a-z)
    options.Password.RequiredUniqueChars = 1; // Минимальное количество уникальных символов в пароле (1 означает, что нет ограничений на повторение символов)

    // Настройки блокировки аккаунта
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5); // Время блокировки аккаунта — 5 минут после превышения лимита неудачных попыток входа
    options.Lockout.MaxFailedAccessAttempts = 5; // Максимальное количество неудачных попыток входа перед блокировкой — 5
    options.Lockout.AllowedForNewUsers = true; // Разрешить блокировку для новых пользователей (если false, новые пользователи не блокируются)

    // Настройки подтверждений при входе
    options.SignIn.RequireConfirmedAccount = false; // Не требуется подтверждение аккаунта для входа (например, через email или телефон)
    options.SignIn.RequireConfirmedEmail = false; // Не требуется подтверждённый email для входа
    options.SignIn.RequireConfirmedPhoneNumber = false; // Не требуется подтверждённый номер телефона для входа

    // Ограничения на имя пользователя
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// 3. Настройка аутентификации JWT Bearer
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = builder.Environment.IsDevelopment() ? false : true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT Secret Key not configured.")))
    };
});

// 4. Регистрация AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// 5. Регистрация сервисов приложения
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProfessionalQualificationService, ProfessionalQualificationService>();
builder.Services.AddScoped<ITrainerDetailsService, TrainerDetailsService>();
builder.Services.AddScoped<IDietitianDetailsService, DietitianDetailsService>();
builder.Services.AddScoped<IDoctorDetailsService, DoctorDetailsService>();
builder.Services.AddScoped<IPsychologistDetailsService, PsychologistDetailsService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// 6. Регистрация репозитория и Unit of Work
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// 7. Конфигурация CORS
builder.Services.AddCors(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        options.AddPolicy("AllowAllOrigins", builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
    }
    else
    {
        options.AddPolicy("AllowSpecificOrigin", builder =>
        {
            builder.WithOrigins("http://localhost:3000") // URL фронтенда
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
        });
    }
});

// 8. Добавление контроллеров и настройка JSON сериализации
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// 9. Добавляем Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "HealthyLifestyle.Api",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme.  
                        Enter 'Bearer' [space] and then your token. Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// --- Создаем и настраиваем конвейер обработки запросов ---

var app = builder.Build();

// Получаем логгер после сборки приложения
var logger = app.Services.GetRequiredService<ILogger<Program>>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection(); // В продакшене HTTPS-редирект будет включен
}
app.UseCors(builder.Environment.IsDevelopment() ? "AllowAllOrigins" : "AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// --- Seed данных при старте приложения ---
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var userManager = services.GetRequiredService<UserManager<User>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            var dbContext = services.GetRequiredService<ApplicationDbContext>();

            logger.LogInformation("Waiting for 5 seconds before applying migrations...");
            await Task.Delay(TimeSpan.FromSeconds(5));
            logger.LogInformation("Attempting to apply migrations...");

            // Применяем миграции
            await dbContext.Database.MigrateAsync();
            logger.LogInformation("Migrations applied successfully.");

            // Заполнение начальными данными
            await ApplicationDbContextSeed.SeedDefaultUserAndRolesAsync(userManager, roleManager, dbContext);
            logger.LogInformation("Database seeded successfully.");
        }
        catch (Exception ex)
        {
            var loggerForSeed = services.GetRequiredService<ILogger<Program>>();
            loggerForSeed.LogError(ex, "An error occurred while seeding the database.");
            throw; // Перебрасываем исключение для отладки
        }
    }
}

app.Run();