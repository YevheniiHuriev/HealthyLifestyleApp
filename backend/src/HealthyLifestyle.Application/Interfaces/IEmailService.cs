using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthyLifestyle.Application.Interfaces
{
    /// <summary>
    /// Інтерфейс для служби відправлення електронних листів.
    /// </summary>
    public interface IEmailService
    {
        #region Методи

        /// <summary>
        /// Асинхронно відправляє електронний лист.
        /// </summary>
        /// <param name="toEmail">Адреса електронної пошти отримувача.</param>
        /// <param name="subject">Тема листа.</param>
        /// <param name="message">Тіло повідомлення листа.</param>
        /// <returns>Задача, що представляє асинхронну операцію відправлення листа.</returns>
        Task SendEmailAsync(string toEmail, string subject, string message);

        #endregion
    }
}
