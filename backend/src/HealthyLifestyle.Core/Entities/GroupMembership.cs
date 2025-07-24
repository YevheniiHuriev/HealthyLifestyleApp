using HealthyLifestyle.Core.Enums;
using System;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Представляє членство користувача в групі.
    /// Зв'язок багато-до-багатьох між User та Group з додатковими даними (роль, дата вступу).
    /// </summary>
    public class GroupMembership : BaseEntity
    {
        /// <summary>
        /// Ідентифікатор групи, до якої належить користувач.
        /// </summary>
        public Guid GroupId { get; set; }

        /// <summary>
        /// Ідентифікатор користувача, який є членом групи.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Дата вступу користувача в групу (за замовчуванням — поточна дата UTC).
        /// </summary>
        public DateTime JoinDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Роль користувача в групі (наприклад, Member, Admin тощо).
        /// </summary>
        public GroupRole Role { get; set; } = GroupRole.Member;

        #region Навігаційні властивості

        /// <summary>
        /// Навігаційна властивість до сутності Group.
        /// </summary>
        public Group Group { get; set; } = null!;

        /// <summary>
        /// Навігаційна властивість до сутності User.
        /// </summary>
        public User User { get; set; } = null!;

        #endregion

        /// <summary>
        /// Порожній конструктор для EF.
        /// </summary>
        public GroupMembership() { }

        /// <summary>
        /// Конструктор для створення нового членства.
        /// </summary>
        /// <param name="groupId">ID групи.</param>
        /// <param name="userId">ID користувача.</param>
        public GroupMembership(Guid groupId, Guid userId)
        {
            GroupId = groupId;
            UserId = userId;
        }
    }
}