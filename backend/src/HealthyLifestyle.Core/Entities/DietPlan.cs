using System;
using System.Collections.Generic;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Клас, що представляє план харчування, успадкований від BaseEntity.
    /// Використовується для зберігання інформації про дієтичний план клієнта.
    /// </summary>
    public class DietPlan : BaseEntity
    {
        #region Властивості

        /// <summary>
        /// Ідентифікатор клієнта, для якого створено план (опціонально).
        /// </summary>
        public Guid ClientId { get; set; }

        /// <summary>
        /// Клієнт, пов’язаний із планом (опціонально).
        /// </summary>
        public User? Client { get; set; }

        /// <summary>
        /// Ідентифікатор дієтолога, який створив план (опціонально).
        /// </summary>
        public Guid? DietitianId { get; set; }

        /// <summary>
        /// Дієтолог, який створив план (опціонально).
        /// </summary>
        public User? Dietitian { get; set; }

        /// <summary>
        /// Назва плану харчування (обов’язково).
        /// </summary>
        public required string Name { get; set; }

        /// <summary>
        /// Опис плану харчування (опціонально).
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Тип дієти (Standard, Keto, Paleo тощо).
        /// </summary>
        public DietType DietType { get; set; }

        /// <summary>
        /// Дата початку дії плану.
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Дата завершення дії плану.
        /// </summary>
        public DateTime EndDate { get; set; }

        /// <summary>
        /// Колекція записів про прийоми їжі, пов’язаних із планом.
        /// </summary>
        public ICollection<MealEntry> MealEntries { get; set; } = new List<MealEntry>();

        #endregion

        #region Конструктори

        /// <summary>
        /// Параметризатор за замовчуванням для використання EF Core.
        /// </summary>
        protected DietPlan() : base()
        {
            MealEntries = new List<MealEntry>();
        }

        /// <summary>
        /// Параметризатор з початковими даними для створення нового плану харчування.
        /// </summary>
        /// <param name="clientId">Ідентифікатор клієнта (опціонально).</param>
        /// <param name="dietitianId">Ідентифікатор дієтолога (опціонально).</param>
        /// <param name="name">Назва плану.</param>
        /// <param name="description">Опис плану (опціонально).</param>
        /// <param name="dietType">Тип дієти.</param>
        /// <param name="startDate">Дата початку.</param>
        /// <param name="endDate">Дата завершення.</param>
        public DietPlan(
            Guid? clientId = null,
            Guid? dietitianId = null,
            string name = "",
            string? description = null,
            DietType dietType = DietType.Standard,
            DateTime startDate = default,
            DateTime endDate = default)
            : this()
        {
            ClientId = clientId ?? Guid.Empty;
            DietitianId = dietitianId;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Description = description;
            DietType = dietType;
            StartDate = startDate == default ? DateTime.UtcNow : startDate;
            EndDate = endDate == default ? StartDate.AddDays(30) : endDate; // За замовчуванням 30 днів
        }

        #endregion
    }

    /// <summary>
    /// Перелік типів дієт.
    /// </summary>
    public enum DietType
    {
        Standard,
        Keto,
        Paleo,
        Vegan,
        Vegetarian,
        Mediterranean,
        GlutenFree,
        DairyFree
    }
}