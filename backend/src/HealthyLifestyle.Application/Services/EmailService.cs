using HealthyLifestyle.Application.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthyLifestyle.Application.Services
{
    // Нам потрібно буде інтегрувати реальний сервіс відправки пошти
    // Для початку використовуэмо заглушку.
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string toEmail, string subject, string message)
        {
            _logger.LogInformation("Отправка email: To={To}, Subject={Subject}, Message={Message}", toEmail, subject, message);
            // Тут буде код для реального відправлення email (например, через SmtpClient, SendGrid API и т.д.)
            // У продакшені ми не використовуватимемо console.writeline.
            // Console.WriteLine($"Sending email to: {toEmail}");
            // Console.WriteLine($"Subject: {subject}");
            // Console.WriteLine($"Body: {message}");
            return Task.CompletedTask;
        }
    }
}
