using System.ComponentModel.DataAnnotations;
using HealthyLifestyle.Core.Enums;

namespace HealthyLifestyle.Application.DTOs.ProfessionalQualification
{
    /// <summary>
    /// DTO для оновлення статусу професійної кваліфікації.
    /// Використовується адміністраторами для зміни статусу заявки.
    /// </summary>
    public class UpdateProfessionalQualificationStatusDto
    {
        /// <summary>
        /// Новий статус кваліфікації. Обов’язкове поле.
        /// </summary>
        [Required(ErrorMessage = "Статус кваліфікації є обов’язковим.")]
        public QualificationStatus Status { get; set; }

        /// <summary>
        /// Примітки адміністратора щодо статусу.
        /// Максимальна довжина — 500 символів.
        /// </summary>
        [StringLength(500, ErrorMessage = "Примітки адміністратора не повинні перевищувати 500 символів.")]
        public string? AdminNotes { get; set; }
    }
}