using HealthyLifestyle.Core.Enums;
using System;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Клас, який представляє консультацію між клієнтом і професіоналом у системі.
    /// Успадкований від базового класу <see cref="BaseEntity"/>.
    /// </summary>
    public class Consultation : BaseEntity
    {
        #region Властивості

        /// <summary>
        /// Ідентифікатор клієнта, який замовив консультацію.
        /// </summary>
        public Guid ClientId { get; set; }

        /// <summary>
        /// Ідентифікатор професіонала, який надає консультацію.
        /// </summary>
        public Guid ProfessionalId { get; set; }

        /// <summary>
        /// Ідентифікатор професійної кваліфікації, пов’язаної з консультацією.
        /// </summary>
        public Guid ProfessionalQualificationId { get; set; }

        /// <summary>
        /// Дата та час проведення консультації.
        /// </summary>
        public DateTime ConsultationDate { get; set; }

        /// <summary>
        /// Тривалість консультації в хвилинах.
        /// </summary>
        public int DurationMinutes { get; set; }

        /// <summary>
        /// Вартість консультації в валюті системи.
        /// </summary>
        public decimal Cost { get; set; }

        /// <summary>
        /// Поточний статус консультації (наприклад, Scheduled, Completed, Canceled).
        /// </summary>
        public ConsultationStatus Status { get; set; }

        /// <summary>
        /// Комісія платформи, яка стягується з вартості консультації.
        /// </summary>
        public decimal PlatformCommission { get; set; }

        /// <summary>
        /// Посилання на онлайн-зустріч (наприклад, Zoom або Google Meet).
        /// </summary>
        public string MeetingLink { get; set; } = string.Empty;

        /// <summary>
        /// Додаткові примітки до консультації (опціонально).
        /// </summary>
        public string? Notes { get; set; }

        #endregion

        #region Навігаційні властивості

        /// <summary>
        /// Клієнт, який замовив консультацію.
        /// </summary>
        public virtual User ClientUser { get; set; } = null!;

        /// <summary>
        /// Професіонал, який надає консультацію.
        /// </summary>
        public virtual User ProfessionalUser { get; set; } = null!;

        /// <summary>
        /// Деталі професійної кваліфікації професіонала, пов’язаної з консультацією.
        /// </summary>
        public virtual UserProfessionalQualification ProfessionalQualification { get; set; } = null!;

        #endregion

        #region Конструктори

        /// <summary>
        /// Параметризатор без параметрів для використання ORM (наприклад, Entity Framework).
        /// </summary>
        public Consultation() : base()
        {
        }

        /// <summary>
        /// Ініціалізує новий екземпляр консультації з базовими даними.
        /// </summary>
        /// <param name="clientId">Ідентифікатор клієнта.</param>
        /// <param name="professionalId">Ідентифікатор професіонала.</param>
        /// <param name="professionalQualificationId">Ідентифікатор професійної кваліфікації.</param>
        /// <param name="consultationDate">Дата та час проведення консультації.</param>
        /// <param name="durationMinutes">Тривалість консультації в хвилинах.</param>
        /// <param name="cost">Вартість консультації.</param>
        /// <param name="meetingLink">Посилання на онлайн-зустріч.</param>
        /// <param name="notes">Додаткові примітки (опціонально).</param>
        /// <exception cref="ArgumentException">Виникає, якщо передані недійсні дані (наприклад, від’ємна тривалість).</exception>
        public Consultation(Guid clientId, Guid professionalId, Guid professionalQualificationId, DateTime consultationDate, int durationMinutes, decimal cost, string meetingLink, string? notes = null) : this()
        {
            if (durationMinutes < 0) throw new ArgumentException("Тривалість консультації не може бути від’ємною.", nameof(durationMinutes));
            if (cost < 0) throw new ArgumentException("Вартість консультації не може бути від’ємною.", nameof(cost));
            if (string.IsNullOrWhiteSpace(meetingLink)) throw new ArgumentException("Посилання на зустріч є обов’язковим.", nameof(meetingLink));

            ClientId = clientId;
            ProfessionalId = professionalId;
            ProfessionalQualificationId = professionalQualificationId;
            ConsultationDate = consultationDate;
            DurationMinutes = durationMinutes;
            Cost = cost;
            MeetingLink = meetingLink;
            Notes = notes;
            Status = ConsultationStatus.Scheduled;
            PlatformCommission = 0;
            SetUpdatedAt();
        }

        #endregion

        #region Методи

        /// <summary>
        /// Скасовує консультацію, оновлюючи її статус на "Canceled".
        /// </summary>
        public void CancelConsultation()
        {
            Status = ConsultationStatus.Canceled;
            SetUpdatedAt();
        }

        /// <summary>
        /// Позначує консультацію як завершена, оновлюючи її статус на "Completed".
        /// </summary>
        public void CompleteConsultation()
        {
            Status = ConsultationStatus.Completed;
            SetUpdatedAt();
        }

        /// <summary>
        /// Оновлює деталі консультації з новими даними (опціонально).
        /// </summary>
        /// <param name="consultationDate">Нова дата та час проведення (опціонально).</param>
        /// <param name="durationMinutes">Нова тривалість у хвилинах (опціонально).</param>
        /// <param name="cost">Нова вартість (опціонально).</param>
        /// <param name="meetingLink">Нове посилання на зустріч (опціонально).</param>
        /// <param name="notes">Нові примітки (опціонально).</param>
        /// <exception cref="ArgumentException">Виникає, якщо передані недійсні дані (наприклад, від’ємна тривалість).</exception>
        public void UpdateConsultation(DateTime? consultationDate = null, int? durationMinutes = null, decimal? cost = null, string? meetingLink = null, string? notes = null)
        {
            if (durationMinutes.HasValue && durationMinutes.Value < 0) throw new ArgumentException("Тривалість консультації не може бути від’ємною.", nameof(durationMinutes));
            if (cost.HasValue && cost.Value < 0) throw new ArgumentException("Вартість консультації не може бути від’ємною.", nameof(cost));
            if (meetingLink != null && string.IsNullOrWhiteSpace(meetingLink)) throw new ArgumentException("Посилання на зустріч є обов’язковим.", nameof(meetingLink));

            if (consultationDate.HasValue) ConsultationDate = consultationDate.Value;
            if (durationMinutes.HasValue) DurationMinutes = durationMinutes.Value;
            if (cost.HasValue) Cost = cost.Value;
            if (meetingLink != null) MeetingLink = meetingLink;
            if (notes != null) Notes = notes;
            SetUpdatedAt();
        }

        #endregion
    }
}