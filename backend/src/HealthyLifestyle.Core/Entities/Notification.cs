using System;
using HealthyLifestyle.Core.Enums;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Повідомлення для користувача.
    /// Зберігає текст повідомлення, його тип та статус прочитання.
    /// Успадкований від базового класу <see cref="BaseEntity"/>.
    /// </summary>
    public class Notification : BaseEntity
    {
        #region Властивості

        /// <summary>
        /// Ідентифікатор користувача, якому належить повідомлення.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Текст повідомлення.
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Тип повідомлення (наприклад: SystemAlert, Reminder, ChallengeInvite і т.д.).
        /// </summary>
        public NotificationType Type { get; set; }

        /// <summary>
        /// Статус прочитання повідомлення.
        /// </summary>
        public bool IsRead { get; set; }

        /// <summary>
        /// Дата і час створення повідомлення (по замовчуванню — поточний UTC час).
        /// Перевизначається для використання DateTime.UtcNow замість базового CreatedAt.
        /// </summary>
        public new DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        #endregion

        #region Навігаційні властивості

        /// <summary>
        /// Навигационное свойство для связи з пользователем, которому принадлежит уведомление.
        /// </summary>
        public virtual User User { get; set; } = null!;

        #endregion

        #region Конструктори

        /// <summary>
        /// Параметризатор за замовчуванням, необхідний для Entity Framework Core.
        /// </summary>
        public Notification() : base()
        {
        }

        /// <summary>
        /// Ініціалізує новий екземпляр повідомлення з базовими даними.
        /// </summary>
        /// <param name="userId">Ідентифікатор користувача.</param>
        /// <param name="message">Текст повідомлення.</param>
        /// <param name="type">Тип повідомлення.</param>
        /// <exception cref="ArgumentException">Виникає, якщо ідентифікатор користувача є порожнім або текст повідомлення відсутній.</exception>
        public Notification(Guid userId, string message, NotificationType type) : this()
        {
            if (userId == Guid.Empty)
                throw new ArgumentException("Ідентифікатор користувача не може бути порожнім.", nameof(userId));
            if (string.IsNullOrWhiteSpace(message))
                throw new ArgumentException("Текст повідомлення є обов’язковим.", nameof(message));

            UserId = userId;
            Message = message;
            Type = type;
            IsRead = false; // По умолчанию уведомление непрочитано
            SetUpdatedAt();
        }

        #endregion

        #region Методи

        /// <summary>
        /// Позначає повідомлення як прочитане.
        /// </summary>
        public void MarkAsRead()
        {
            if (!IsRead)
            {
                IsRead = true;
                SetUpdatedAt();
            }
        }

        /// <summary>
        /// Позначає повідомлення як непрочитане.
        /// </summary>
        public void MarkAsUnread()
        {
            if (IsRead)
            {
                IsRead = false;
                SetUpdatedAt();
            }
        }

        /// <summary>
        /// Оновлює текст повідомлення з новим вмістом.
        /// </summary>
        /// <param name="newMessage">Новий текст повідомлення.</param>
        /// <exception cref="ArgumentException">Виникає, якщо новий текст повідомлення відсутній.</exception>
        public void UpdateMessage(string newMessage)
        {
            if (string.IsNullOrWhiteSpace(newMessage))
                throw new ArgumentException("Текст повідомлення є обов’язковим.", nameof(newMessage));

            if (Message != newMessage)
            {
                Message = newMessage;
                SetUpdatedAt();
            }
        }

        #endregion
    }
}