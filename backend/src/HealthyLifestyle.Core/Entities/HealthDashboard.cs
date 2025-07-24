using System;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Зведена панель здоров'я користувача.
    /// Зберігає агреговані або розрахункові показники, такі як поточний індекс маси тіла (BMI) або цільова калорійність.
    /// Успадкована від базового класу <see cref="BaseEntity"/>.
    /// </summary>
    public class HealthDashboard : BaseEntity
    {
        #region Властивості

        /// <summary>
        /// Ідентифікатор користувача, до якого відноситься цей дашборд.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Навігаційна властивість для зв'язку з користувачем, якому належить дашборд.
        /// </summary>
        public virtual User User { get; set; } = null!;

        /// <summary>
        /// Поточний індекс маси тіла (BMI) користувача, розрахований на основі зросту та ваги.
        /// </summary>
        public double CurrentBMI { get; set; }

        /// <summary>
        /// Цільова денна норма калорій для користувача, визначена на основі його цілей та активності.
        /// </summary>
        public int CaloriesGoal { get; set; }

        #endregion

        #region Конструктори

        /// <summary>
        /// Параметризатор за замовчуванням, необхідний для Entity Framework Core.
        /// </summary>
        public HealthDashboard() : base()
        {
        }

        /// <summary>
        /// Ініціалізує новий екземпляр панелі здоров’я для заданого користувача.
        /// </summary>
        /// <param name="userId">Ідентифікатор користувача.</param>
        /// <exception cref="ArgumentException">Виникає, якщо ідентифікатор користувача є порожнім.</exception>
        public HealthDashboard(Guid userId) : this()
        {
            if (userId == Guid.Empty)
                throw new ArgumentException("Ідентифікатор користувача не може бути порожнім.", nameof(userId));

            UserId = userId;
            SetUpdatedAt();
        }

        #endregion

        #region Методи

        /// <summary>
        /// Оновлює показники дашборда з новими значеннями (опціонально).
        /// </summary>
        /// <param name="currentBMI">Новий індекс маси тіла (опціонально).</param>
        /// <param name="caloriesGoal">Нова цільова норма калорій (опціонально).</param>
        /// <exception cref="ArgumentException">Виникає, якщо передані недійсні значення (наприклад, від’ємні калорії).</exception>
        public void UpdateDashboard(double? currentBMI = null, int? caloriesGoal = null)
        {
            if (currentBMI.HasValue && currentBMI.Value < 0)
                throw new ArgumentException("Індекс маси тіла не може бути від’ємним.", nameof(currentBMI));
            if (caloriesGoal.HasValue && caloriesGoal.Value < 0)
                throw new ArgumentException("Цільова норма калорій не може бути від’ємною.", nameof(caloriesGoal));

            if (currentBMI.HasValue) CurrentBMI = currentBMI.Value;
            if (caloriesGoal.HasValue) CaloriesGoal = caloriesGoal.Value;
            SetUpdatedAt();
        }

        /// <summary>
        /// Розраховує індекс маси тіла (BMI) на основі ваги (кг) та зросту (м).
        /// </summary>
        /// <param name="weightKg">Вага користувача в кілограмах.</param>
        /// <param name="heightM">Зріст користувача в метрах.</param>
        /// <returns>Розрахований індекс маси тіла.</returns>
        /// <exception cref="ArgumentException">Виникає, якщо вага або зріст є недійсними (менше або дорівнює 0).</exception>
        public double CalculateBMI(double weightKg, double heightM)
        {
            if (weightKg <= 0)
                throw new ArgumentException("Вага повинна бути позитивним числом.", nameof(weightKg));
            if (heightM <= 0)
                throw new ArgumentException("Зріст повинен бути позитивним числом.", nameof(heightM));

            return weightKg / (heightM * heightM);
        }

        #endregion
    }
}