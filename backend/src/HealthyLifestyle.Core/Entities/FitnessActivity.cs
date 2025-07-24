using System;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Сутність для обліку фітнес-активностей користувача (наприклад: біг, плавання, тренування тощо).
    /// Успадкована від базового класу <see cref="BaseEntity"/> для забезпечення спільних властивостей, таких як ідентифікатор та мітки часу.
    /// </summary>
    public class FitnessActivity : BaseEntity
    {
        #region Властивості

        /// <summary>
        /// Ідентифікатор користувача, який виконав активність.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Ідентифікатор тренування з бібліотеки Workouts (якщо активність базується на збереженому тренуванні).
        /// Може бути null, якщо активність була спонтанною.
        /// </summary>
        public Guid? WorkoutId { get; set; }

        /// <summary>
        /// Тип активності (наприклад: "Біг", "Плавання", "Силове тренування" тощо).
        /// </summary>
        public string ActivityType { get; set; } = string.Empty;

        /// <summary>
        /// Тривалість активності в хвилинах.
        /// </summary>
        public int DurationMinutes { get; set; }

        /// <summary>
        /// Кількість спалених калорій під час даної активності.
        /// </summary>
        public int CaloriesBurned { get; set; }

        /// <summary>
        /// Дата та час виконання активності.
        /// </summary>
        public DateTime ActivityDate { get; set; }

        /// <summary>
        /// Додаткові примітки про тренування (опціонально).
        /// </summary>
        public string? Notes { get; set; }

        #endregion

        #region Навігаційні властивості

        /// <summary>
        /// Навігаційна властивість для зв'язку з користувачем, який виконав активність.
        /// </summary>
        public virtual User User { get; set; } = null!;

        /// <summary>
        /// Навігаційна властивість для зв'язку з тренуванням з бібліотеки (якщо застосовно).
        /// </summary>
        public virtual Workout? Workout { get; set; }

        #endregion

        #region Конструктори

        /// <summary>
        /// Конструктор за замовчуванням, необхідний для Entity Framework Core.
        /// </summary>
        public FitnessActivity() : base()
        {
        }

        /// <summary>
        /// Ініціалізує новий екземпляр фітнес-активності з базовими даними.
        /// </summary>
        /// <param name="userId">Ідентифікатор користувача.</param>
        /// <param name="activityType">Тип активності.</param>
        /// <param name="durationMinutes">Тривалість у хвилинах.</param>
        /// <param name="caloriesBurned">Кількість спалених калорій.</param>
        /// <param name="activityDate">Дата та час активності.</param>
        /// <param name="workoutId">Ідентифікатор тренування з бібліотеки (опціонально).</param>
        /// <param name="notes">Додаткові примітки (опціонально).</param>
        /// <exception cref="ArgumentException">Виникає, якщо передані недійсні дані (наприклад, від'ємна тривалість або порожній тип активності).</exception>
        public FitnessActivity(Guid userId, string activityType, int durationMinutes, int caloriesBurned, DateTime activityDate, Guid? workoutId = null, string? notes = null) : this()
        {
            if (string.IsNullOrWhiteSpace(activityType))
                throw new ArgumentException("Тип активності є обов’язковим.", nameof(activityType));
            if (durationMinutes < 0)
                throw new ArgumentException("Тривалість активності не може бути від’ємною.", nameof(durationMinutes));
            if (caloriesBurned < 0)
                throw new ArgumentException("Кількість спалених калорій не може бути від’ємною.", nameof(caloriesBurned));

            UserId = userId;
            ActivityType = activityType;
            DurationMinutes = durationMinutes;
            CaloriesBurned = caloriesBurned;
            ActivityDate = activityDate;
            WorkoutId = workoutId;
            Notes = notes;
            SetUpdatedAt();
        }

        #endregion

        #region Методи

        /// <summary>
        /// Оновлює деталі активності з новими значеннями (опціонально).
        /// </summary>
        /// <param name="activityType">Новий тип активності (опціонально).</param>
        /// <param name="durationMinutes">Нова тривалість у хвилинах (опціонально).</param>
        /// <param name="caloriesBurned">Нова кількість спалених калорій (опціонально).</param>
        /// <param name="activityDate">Нова дата та час активності (опціонально).</param>
        /// <param name="workoutId">Новий ідентифікатор тренування (опціонально).</param>
        /// <param name="notes">Нові примітки (опціонально).</param>
        /// <exception cref="ArgumentException">Виникає, якщо передані недійсні дані (наприклад, від’ємна тривалість або порожній тип активності).</exception>
        public void UpdateActivity(string? activityType = null, int? durationMinutes = null, int? caloriesBurned = null, DateTime? activityDate = null, Guid? workoutId = null, string? notes = null)
        {
            if (activityType != null && string.IsNullOrWhiteSpace(activityType))
                throw new ArgumentException("Тип активності є обов’язковим.", nameof(activityType));
            if (durationMinutes.HasValue && durationMinutes.Value < 0)
                throw new ArgumentException("Тривалість активності не може бути від’ємною.", nameof(durationMinutes));
            if (caloriesBurned.HasValue && caloriesBurned.Value < 0)
                throw new ArgumentException("Кількість спалених калорій не може бути від’ємною.", nameof(caloriesBurned));

            if (activityType != null) ActivityType = activityType;
            if (durationMinutes.HasValue) DurationMinutes = durationMinutes.Value;
            if (caloriesBurned.HasValue) CaloriesBurned = caloriesBurned.Value;
            if (activityDate.HasValue) ActivityDate = activityDate.Value;
            if (workoutId.HasValue) WorkoutId = workoutId.Value;
            if (notes != null) Notes = notes;
            SetUpdatedAt();
        }

        #endregion
    }
}