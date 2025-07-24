using HealthyLifestyle.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Сутність продукту (товару), який може бути куплений користувачами.
    /// Успадкований від базового класу <see cref="BaseEntity"/>
    /// </summary>
    public class Product : BaseEntity
    {
        #region Властивості

        /// <summary>
        /// Назва продукту.
        /// </summary>
        [Required(ErrorMessage = "Назва продукту є обов'язковою.")]
        [StringLength(255, MinimumLength = 2, ErrorMessage = "Назва продукту повинна містити від 2 до 255 символів.")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Категорія продукту (наприклад, Nutrition, Equipment тощо).
        /// </summary>
        [Required(ErrorMessage = "Категорія продукту є обов'язковою.")]
        public ProductCategory Category { get; set; }

        /// <summary>
        /// Ціна продукту.
        /// </summary>
        [Range(0.01, double.MaxValue, ErrorMessage = "Ціна продукту повинна бути позитивним числом.")]
        public decimal Price { get; set; }

        /// <summary>
        /// Бренд або виробник продукту.
        /// </summary>
        [Required(ErrorMessage = "Бренд є обов'язковим.")]
        [StringLength(255, MinimumLength = 2, ErrorMessage = "Назва бренду повинна містити від 2 до 255 символів.")]
        public string Brand { get; set; } = string.Empty;

        /// <summary>
        /// Опис продукту.
        /// </summary>
        [Required(ErrorMessage = "Опис продукту є обов'язковим.")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Опис продукту повинен містити від 10 до 1000 символів.")]
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Посилання на зображення продукту (може бути null).
        /// </summary>
        [Url(ErrorMessage = "Недійсний формат URL зображення.")]
        public string? ImageUrl { get; set; }

        /// <summary>
        /// Кількість товару на складі.
        /// </summary>
        [Range(0, int.MaxValue, ErrorMessage = "Кількість на складі не може бути від'ємною.")]
        public int StockQuantity { get; set; }

        /// <summary>
        /// Процент комісії платформи (наприклад, 0.10 = 10%).
        /// </summary>
        [Range(0.0, 1.0, ErrorMessage = "Комісія платформи повинна бути в діапазоні від 0 до 1.")]
        public decimal PlatformCommissionPercentage { get; set; }

        #endregion

        #region Навігаційні властивості

        /// <summary>
        /// Навігаційна властивість: список позицій замовлення, пов'язаних із цим продуктом.
        /// </summary>
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        #endregion

        #region Конструктори

        /// <summary>
        /// Конструктор за замовчуванням, необхідний для Entity Framework Core.
        /// </summary>
        public Product() : base()
        {
        }

        /// <summary>
        /// Ініціалізує новий екземпляр продукту з базовими даними.
        /// </summary>
        /// <param name="name">Назва продукту.</param>
        /// <param name="category">Категорія продукту.</param>
        /// <param name="price">Ціна продукту.</param>
        /// <param name="brand">Бренд.</param>
        /// <param name="description">Опис.</param>
        /// <param name="stockQuantity">Кількість на складі.</param>
        /// <param name="platformCommissionPercentage">Комісія платформи.</param>
        /// <param name="imageUrl">URL зображення (опціонально).</param>
        /// <exception cref="ArgumentException">Виникає, якщо передані недійсні дані (наприклад, від'ємна ціна або кількість).</exception>
        public Product(string name, ProductCategory category, decimal price, string brand, string description, int stockQuantity, decimal platformCommissionPercentage, string? imageUrl = null) : this()
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Назва продукту є обов'язковою.", nameof(name));
            if (string.IsNullOrWhiteSpace(brand))
                throw new ArgumentException("Бренд є обов'язковим.", nameof(brand));
            if (string.IsNullOrWhiteSpace(description))
                throw new ArgumentException("Опис продукту є обов'язковим.", nameof(description));
            if (price < 0)
                throw new ArgumentException("Ціна не може бути від'ємною.", nameof(price));
            if (stockQuantity < 0)
                throw new ArgumentException("Кількість на складі не може бути від'ємною.", nameof(stockQuantity));
            if (platformCommissionPercentage < 0 || platformCommissionPercentage > 1)
                throw new ArgumentException("Комісія платформи повинна бути в діапазоні від 0 до 1.", nameof(platformCommissionPercentage));

            Name = name;
            Category = category;
            Price = price;
            Brand = brand;
            Description = description;
            StockQuantity = stockQuantity;
            PlatformCommissionPercentage = platformCommissionPercentage;
            ImageUrl = imageUrl;
            SetUpdatedAt(); // Встановлюємо UpdatedAt при створенні
        }

        #endregion

        #region Методи

        /// <summary>
        /// Оновлює дані продукту з новими значеннями (опціонально).
        /// </summary>
        /// <param name="name">Нова назва (опціонально).</param>
        /// <param name="category">Нова категорія (опціонально).</param>
        /// <param name="price">Нова ціна (опціонально).</param>
        /// <param name="brand">Новий бренд (опціонально).</param>
        /// <param name="description">Новий опис (опціонально).</param>
        /// <param name="stockQuantity">Нова кількість на складі (опціонально).</param>
        /// <param name="platformCommissionPercentage">Нова комісія платформи (опціонально).</param>
        /// <param name="imageUrl">Новий URL зображення (опціонально).</param>
        /// <exception cref="ArgumentException">Виникає, якщо передані недійсні дані (наприклад, від'ємна ціна або кількість).</exception>
        public void UpdateProduct(
            string? name = null,
            ProductCategory? category = null,
            decimal? price = null,
            string? brand = null,
            string? description = null,
            int? stockQuantity = null,
            decimal? platformCommissionPercentage = null,
            string? imageUrl = null)
        {
            // Перевірки на валідність вхідних даних
            if (name != null && string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Назва продукту є обов'язковою.", nameof(name));
            if (brand != null && string.IsNullOrWhiteSpace(brand))
                throw new ArgumentException("Бренд є обов'язковим.", nameof(brand));
            if (description != null && string.IsNullOrWhiteSpace(description))
                throw new ArgumentException("Опис продукту є обов'язковим.", nameof(description));
            if (price.HasValue && price.Value < 0)
                throw new ArgumentException("Ціна не може бути від'ємною.", nameof(price));
            if (stockQuantity.HasValue && stockQuantity.Value < 0)
                throw new ArgumentException("Кількість на складі не може бути від'ємною.", nameof(stockQuantity));
            if (platformCommissionPercentage.HasValue && (platformCommissionPercentage.Value < 0 || platformCommissionPercentage.Value > 1))
                throw new ArgumentException("Комісія платформи повинна бути в діапазоні від 0 до 1.", nameof(platformCommissionPercentage));

            // Оновлення властивостей, якщо надані нові значення
            bool changed = false;
            if (name != null && Name != name) { Name = name; changed = true; }
            if (category.HasValue && Category != category.Value) { Category = category.Value; changed = true; }
            if (price.HasValue && Price != price.Value) { Price = price.Value; changed = true; }
            if (brand != null && Brand != brand) { Brand = brand; changed = true; }
            if (description != null && Description != description) { Description = description; changed = true; }
            if (stockQuantity.HasValue && StockQuantity != stockQuantity.Value) { StockQuantity = stockQuantity.Value; changed = true; }
            if (platformCommissionPercentage.HasValue && PlatformCommissionPercentage != platformCommissionPercentage.Value) { PlatformCommissionPercentage = platformCommissionPercentage.Value; changed = true; }
            if (imageUrl != null && ImageUrl != imageUrl) { ImageUrl = imageUrl; changed = true; }

            if (changed)
            {
                SetUpdatedAt(); // Оновлюємо мітку часу, якщо будь-яка властивість була змінена
            }
        }

        /// <summary>
        /// Розраховує суму комісії платформи для цього продукту.
        /// </summary>
        /// <returns>Сума комісії в валюті.</returns>
        public decimal CalculatePlatformCommission()
        {
            return Price * PlatformCommissionPercentage;
        }

        /// <summary>
        /// Зменшує кількість товару на складі на вказану величину.
        /// </summary>
        /// <param name="quantityToDecrease">Кількість, на яку потрібно зменшити.</param>
        /// <exception cref="ArgumentException">Виникає, якщо кількість для зменшення є недійсною або перевищує наявну кількість на складі.</exception>
        public void DecreaseStock(int quantityToDecrease)
        {
            if (quantityToDecrease <= 0)
                throw new ArgumentException("Кількість для зменшення повинна бути позитивним числом.", nameof(quantityToDecrease));
            if (StockQuantity < quantityToDecrease)
                throw new ArgumentException("Недостатньо товару на складі.", nameof(quantityToDecrease));

            StockQuantity -= quantityToDecrease;
            SetUpdatedAt();
        }

        /// <summary>
        /// Збільшує кількість товару на складі на вказану величину.
        /// </summary>
        /// <param name="quantityToIncrease">Кількість, на яку потрібно збільшити.</param>
        /// <exception cref="ArgumentException">Виникає, якщо кількість для збільшення є недійсною.</exception>
        public void IncreaseStock(int quantityToIncrease)
        {
            if (quantityToIncrease <= 0)
                throw new ArgumentException("Кількість для збільшення повинна бути позитивним числом.", nameof(quantityToIncrease));

            StockQuantity += quantityToIncrease;
            SetUpdatedAt();
        }

        #endregion
    }
}