using HealthyLifestyle.Core.Enums;

namespace HealthyLifestyle.Application.DTOs.Shop
{
    /// <summary>
    /// Об’єкт передачі даних для представлення замовлення.
    /// </summary>
    public class OrderDto
    {
        #region Властивості

        /// <summary>
        /// Унікальний ідентифікатор замовлення.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Унікальний ідентифікатор користувача, який створив замовлення.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Електронна пошта користувача, який створив замовлення.
        /// </summary>
        public string UserEmail { get; set; } = string.Empty;

        /// <summary>
        /// Дата створення замовлення.
        /// </summary>
        public DateTime OrderDate { get; set; }

        /// <summary>
        /// Загальна сума замовлення.
        /// </summary>
        public decimal TotalAmount { get; set; }

        /// <summary>
        /// Адреса доставки замовлення.
        /// </summary>
        public string ShippingAddress { get; set; } = string.Empty;

        /// <summary>
        /// Статус замовлення.
        /// </summary>
        /// <remarks>
        /// Використовує перелік <see cref="OrderStatus"/> для визначення стану замовлення.
        /// </remarks>
        public OrderStatus Status { get; set; }

        /// <summary>
        /// Колекція позицій замовлення.
        /// </summary>
        public ICollection<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();

        /// <summary>
        /// Дата створення запису про замовлення.
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Дата останнього оновлення замовлення, якщо воно було оновлено.
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        #endregion
    }

    /// <summary>
    /// Об’єкт передачі даних для представлення позиції замовлення.
    /// </summary>
    public class OrderItemDto
    {
        #region Властивості

        /// <summary>
        /// Унікальний ідентифікатор позиції замовлення.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Унікальний ідентифікатор замовлення, до якого належить позиція.
        /// </summary>
        public Guid OrderId { get; set; }

        /// <summary>
        /// Унікальний ідентифікатор продукту в позиції замовлення.
        /// </summary>
        public Guid ProductId { get; set; }

        /// <summary>
        /// Назва продукту в позиції замовлення.
        /// </summary>
        public string ProductName { get; set; } = string.Empty;

        /// <summary>
        /// Кількість одиниць продукту в позиції замовлення.
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        /// Ціна продукту на момент покупки.
        /// </summary>
        public decimal PriceAtPurchase { get; set; }

        #endregion
    }
}
