using HealthyLifestyle.Core.Enums;
using System;
using System.Collections.Generic;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Сутність, що представляє соціальний виклик (челендж), у якому можуть брати участь користувачі.
    /// Кожен челендж має назву, опис, дати проведення, тип та создателя.
    /// </summary>
    public class SocialChallenge : BaseEntity
    {
        #region Властивості

        /// <summary>
        /// Назва челенджу.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Опис челенджу (що потрібно зробити, мета тощо).
        /// </summary>
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Дата початку челенджу.
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Дата закінчення челенджу.
        /// </summary>
        public DateTime EndDate { get; set; }

        /// <summary>
        /// Ідентифікатор користувача, який створив цей челендж.
        /// </summary>
        public Guid CreatorId { get; set; }

        /// <summary>
        /// Тип челенджу (наприклад: фізичний, психологічний тощо).
        /// Зберігається як перерахування ChallengeType.
        /// </summary>
        public ChallengeType Type { get; set; }

        /// <summary>
        /// Навігаційна властивість для доступу до творця челенджу (користувача).
        /// </summary>
        public User Creator { get; set; } = null!;

        /// <summary>
        /// Список усіх участей користувачів у цьому челенджі.
        /// </summary>
        public ICollection<UserChallengeParticipation> Participations { get; set; } = new List<UserChallengeParticipation>();
        #endregion

        #region Конструктори

        /// <summary>
        /// Порожній конструктор, необхідний для EF Core.
        /// </summary>
        public SocialChallenge() { }

        /// <summary>
        /// Конструктор з параметрами для створення нового челенджу.
        /// </summary>
        /// <param name="name">Назва челенджу.</param>
        /// <param name="description">Опис челенджу.</param>
        /// <param name="startDate">Дата початку.</param>
        /// <param name="endDate">Дата закінчення.</param>
        /// <param name="creatorId">Ідентифікатор творця.</param>
        /// <param name="type">Тип челенджу.</param>
        public SocialChallenge(string name, string description, DateTime startDate, DateTime endDate, Guid creatorId, ChallengeType type)
        {
            Name = name;
            Description = description;
            StartDate = startDate;
            EndDate = endDate;
            CreatorId = creatorId;
            Type = type;
        }
        #endregion
    }
}