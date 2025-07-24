using HealthyLifestyle.Core.Enums;
using System;
using System.Collections.Generic;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Сутність, що представляє тренування (вправу або комплекс вправ).
    /// Містить основну інформацію про тип, складність, опис та пов’язану анімацію.
    /// </summary>
    public class Workout : BaseEntity
    {
        /// <summary>
        /// Назва тренування.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Тип тренування (наприклад: Силове, Кардіо тощо).
        /// </summary>
        public WorkoutType Type { get; set; }

        /// <summary>
        /// Опис тренування (наприклад: техніка виконання, рекомендації).
        /// </summary>
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// URL-адреса анімації або відео з демонстрацією виконання (опціонально).
        /// </summary>
        public string? AnimationUrl { get; set; }

        /// <summary>
        /// Рівень складності тренування (наприклад: Легкий, Середній, Важкий).
        /// </summary>
        public Difficulty DifficultyLevel { get; set; }

        /// <summary>
        /// Навігаційна властивість.
        /// Список активностей користувачів, пов’язаних із цим тренуванням.
        /// </summary>
        public ICollection<FitnessActivity> FitnessActivities { get; set; } = new List<FitnessActivity>();

        /// <summary>
        /// Конструктор без параметрів (необхідний для EF Core).
        /// </summary>
        public Workout() { }

        /// <summary>
        /// Конструктор для створення нового тренування.
        /// </summary>
        /// <param name="name">Назва тренування.</param>
        /// <param name="type">Тип тренування.</param>
        /// <param name="description">Опис.</param>
        /// <param name="difficultyLevel">Рівень складності.</param>
        /// <param name="animationUrl">Посилання на анімацію (опціонально).</param>
        public Workout(string name, WorkoutType type, string description, Difficulty difficultyLevel, string? animationUrl = null)
        {
            Name = name;
            Type = type;
            Description = description;
            DifficultyLevel = difficultyLevel;
            AnimationUrl = animationUrl;
        }

        /// <summary>
        /// Повертає короткі інструкції з виконання тренування.
        /// </summary>
        /// <returns>Рядок з інструкціями.</returns>
        public string GetInstructions()
        {
            // Заглушка. Тут може бути логіка отримання детальніших інструкцій.
            return $"Інструкція для {Name}: {Description}";
        }
    }
}