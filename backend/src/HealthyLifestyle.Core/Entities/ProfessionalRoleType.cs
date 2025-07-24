using HealthyLifestyle.Core.Enums;
using System;
using System.Collections.Generic;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Клас, що представляє тип професійної ролі, успадкований від BaseEntity.
    /// Використовується для зберігання інформації про назву ролі, опис та типову погодинну ставку.
    /// </summary>
    public class ProfessionalRoleType : BaseEntity
    {
        #region Властивості

        /// <summary>
        /// Назва професійної ролі (наприклад, Dietitian, Trainer тощо).
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Опис ролі (опціонально, за замовчуванням порожній рядок).
        /// </summary>
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Типова погодинна ставка для ролі (опціонально).
        /// </summary>
        public decimal? DefaultHourlyRate { get; set; }

        /// <summary>
        /// Колекція кваліфікацій користувачів, пов’язаних із цією роллю.
        /// </summary>
        public virtual ICollection<UserProfessionalQualification> UserProfessionalQualifications { get; set; } = new List<UserProfessionalQualification>();

        #endregion

        #region Конструктори

        /// <summary>
        /// Параметризатор за замовчуванням, який генерує новий GUID та ініціалізує базовий клас.
        /// Використовується для створення нових сутностей.
        /// </summary>
        public ProfessionalRoleType() : base()
        {
        }

        /// <summary>
        /// Параметризатор з початковими даними для створення нового типу ролі.
        /// </summary>
        /// <param name="name">Назва ролі.</param>
        /// <param name="description">Опис ролі.</param>
        /// <param name="defaultHourlyRate">Типова погодинна ставка (опціонально).</param>
        public ProfessionalRoleType(string name, string description, decimal? defaultHourlyRate = null) : this()
        {
            Name = name;
            Description = description;
            DefaultHourlyRate = defaultHourlyRate;
        }

        #endregion

        #region Методи

        /// <summary>
        /// Оновлює деталі типу ролі з новими значеннями (опціонально).
        /// </summary>
        /// <param name="description">Новий опис ролі (опціонально).</param>
        /// <param name="defaultHourlyRate">Нова типова погодинна ставка (опціонально).</param>
        public void UpdateRoleType(string? description = null, decimal? defaultHourlyRate = null)
        {
            if (description != null) Description = description;
            if (defaultHourlyRate.HasValue) DefaultHourlyRate = defaultHourlyRate.Value;
            SetUpdatedAt();
        }

        #endregion
    }
}