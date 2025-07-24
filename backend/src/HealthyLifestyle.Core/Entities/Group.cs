using System;
using System.Collections.Generic;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Клас, що представляє групу, успадкований від BaseEntity.
    /// Використовується для зберігання інформації про групу та її членів.
    /// </summary>
    public class Group : BaseEntity
    {
        #region Властивості

        /// <summary>
        /// Назва групи (обов’язково).
        /// </summary>
        public required string Name { get; set; }

        /// <summary>
        /// Опис групи (опціонально).
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Ідентифікатор творця групи.
        /// </summary>
        public Guid CreatorId { get; set; }

        /// <summary>
        /// Творець групи (обов’язково).
        /// </summary>
        public required User Creator { get; set; }

        /// <summary>
        /// Дата створення групи.
        /// </summary>
        public DateTime CreationDate { get; set; }

        /// <summary>
        /// Колекція членств у групі.
        /// </summary>
        public ICollection<GroupMembership> GroupMemberships { get; set; } = new List<GroupMembership>();

        #endregion

        #region Конструктори

        /// <summary>
        /// Параметризатор за замовчуванням для використання EF Core.
        /// </summary>
        protected Group() : base()
        {
            GroupMemberships = new List<GroupMembership>();
        }

        /// <summary>
        /// Параметризатор з початковими даними для створення нової групи.
        /// </summary>
        /// <param name="name">Назва групи.</param>
        /// <param name="creatorId">Ідентифікатор творця.</param>
        /// <param name="description">Опис групи (опціонально).</param>
        /// <param name="creationDate">Дата створення (опціонально).</param>
        public Group(
            string name,
            Guid creatorId,
            string? description = null,
            DateTime? creationDate = null)
            : this()
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
            CreatorId = creatorId;
            Description = description;
            CreationDate = creationDate ?? DateTime.UtcNow;
        }

        #endregion
    }
}