using HealthyLifestyle.Core.Enums;
using System;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Сутність, що відображає участь користувача в соціальному виклику (челенджі).
    /// Зберігає поточний прогрес, статус та дату приєднання.
    /// </summary>
    public class UserChallengeParticipation : BaseEntity
    {
        #region Властивості

        /// <summary>
        /// Ідентифікатор користувача, який бере участь у челенджі.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Ідентифікатор соціального виклику (челенджу), у якому бере участь користувач.
        /// </summary>
        public Guid ChallengeId { get; set; }

        /// <summary>
        /// Прогрес виконання челенджу користувачем.
        /// Значення від 0.0 до 1.0 (наприклад, 0.5 = 50% виконання).
        /// </summary>
        public double Progress { get; set; }

        /// <summary>
        /// Поточний статус участі (наприклад: У процесі, Завершено, Скасовано).
        /// </summary>
        public ParticipationStatus Status { get; set; }

        /// <summary>
        /// Дата приєднання користувача до челенджу.
        /// За замовчуванням встановлюється поточна дата та час (UTC).
        /// </summary>
        public DateTime JoinDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Навігаційна властивість до сутності користувача.
        /// </summary>
        public User User { get; set; } = null!;

        /// <summary>
        /// Навігаційна властивість до соціального виклику (челенджу).
        /// </summary>
        public SocialChallenge Challenge { get; set; } = null!;
        #endregion

        #region Конструктори

        /// <summary>
        /// Конструктор без параметрів для EF Core.
        /// </summary>
        public UserChallengeParticipation() { }

        /// <summary>
        /// Конструктор для створення нової участі користувача в челенджі.
        /// </summary>
        /// <param name="userId">Ідентифікатор користувача.</param>
        /// <param name="challengeId">Ідентифікатор челенджу.</param>
        public UserChallengeParticipation(Guid userId, Guid challengeId)
        {
            UserId = userId;
            ChallengeId = challengeId;
            Progress = 0.0;
            Status = ParticipationStatus.InProgress;
        }
        #endregion

        #region Методи

        /// <summary>
        /// Оновлює прогрес користувача в челенджі.
        /// При досягненні 100% прогресу статус автоматично змінюється на Завершено.
        /// </summary>
        /// <param name="newProgress">Нове значення прогресу (від 0.0 до 1.0).</param>
        /// <exception cref="ArgumentOutOfRangeException">Якщо значення прогресу виходить за допустимі межі.</exception>
        public void UpdateProgress(double newProgress)
        {
            if (newProgress < 0.0 || newProgress > 1.0)
            {
                throw new ArgumentOutOfRangeException(nameof(newProgress), "Прогрес має бути в діапазоні від 0.0 до 1.0.");
            }

            Progress = newProgress;

            if (Progress >= 1.0)
            {
                Status = ParticipationStatus.Completed;
            }
        }
        #endregion
    }
}