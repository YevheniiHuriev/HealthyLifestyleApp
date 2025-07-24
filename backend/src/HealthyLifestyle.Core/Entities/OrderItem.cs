using System;

namespace HealthyLifestyle.Core.Entities
{
    /// <summary>
    /// Сутність елемента замовлення (позиція в замовленні).
    /// Містить інформацію про товар, кількість та ціну на момент покупки.
    /// Успадкований від базового класу <see cref="BaseEntity"/>.
    /// </summary>
    public class OrderItem : BaseEntity
    {
        #region Властивості

        /// <summary>
        /// Ідентифікатор замовлення, до якого належить дана позиція.
        /// </summary>
        public Guid OrderId { get; set; }

        /// <summary>
        /// Ідентифікатор продукту, який був замовлений.
        /// </summary>
        public Guid ProductId { get; set; }

        /// <summary>
        /// Кількість одиниць продукту в замовленні.
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        /// Ціна однієї одиниці товару на момент покупки.
        /// </summary>
        public decimal PriceAtPurchase { get; set; }

        #endregion

        #region Навігаційні властивості

        /// <summary>
        /// Навигационное свойство для связи з замовленням, якому належить ця позиція.
        /// </summary>
        public virtual Order Order { get; set; } = null!;

        /// <summary>
        /// Навигационное свойство для связи з продуктом, пов’язаним із цією позицією замовлення.
        /// </summary>
        public virtual Product Product { get; set; } = null!;

        #endregion

        #region Конструктори

        /// <summary>
        /// Параметризатор за замовчуванням, необхідний для Entity Framework Core.
        /// </summary>
        public OrderItem() : base()
        {
        }

        /// <summary>
        /// Ініціалізує новий екземпляр позиції замовлення з базовими даними.
        /// </summary>
        /// <param name="orderId">Ідентифікатор замовлення.</param>
        /// <param name="productId">Ідентифікатор продукту.</param>
        /// <param name="quantity">Кількість.</param>
        /// <param name="priceAtPurchase">Ціна за одиницю на момент покупки.</param>
        /// <exception cref="ArgumentException">Виникає, якщо передані недійсні дані (наприклад, від’ємна кількість або ціна).</exception>
        public OrderItem(Guid orderId, Guid productId, int quantity, decimal priceAtPurchase) : this()
        {
            if (orderId == Guid.Empty)
                throw new ArgumentException("Ідентифікатор замовлення не може бути порожнім.", nameof(orderId));
            if (productId == Guid.Empty)
                throw new ArgumentException("Ідентифікатор продукту не може бути порожнім.", nameof(productId));
            if (quantity <= 0)
                throw new ArgumentException("Кількість повинна бути позитивним числом.", nameof(quantity));
            if (priceAtPurchase < 0)
                throw new ArgumentException("Ціна не може бути від’ємною.", nameof(priceAtPurchase));

            OrderId = orderId;
            ProductId = productId;
            Quantity = quantity;
            PriceAtPurchase = priceAtPurchase;
            SetUpdatedAt();
        }

        #endregion

        #region Методи

        /// <summary>
        /// Розраховує загальну вартість даної позиції (ціна * кількість).
        /// </summary>
        /// <returns>Загальна вартість позиції.</returns>
        public decimal CalculateItemTotal()
        {
            return Quantity * PriceAtPurchase;
        }

        /// <summary>
        /// Оновлює кількість одиниць у позиції замовлення.
        /// </summary>
        /// <param name="newQuantity">Нова кількість.</param>
        /// <exception cref="ArgumentException">Виникає, якщо нова кількість недійсна (менше або дорівнює 0).</exception>
        public void UpdateQuantity(int newQuantity)
        {
            if (newQuantity <= 0)
                throw new ArgumentException("Кількість повинна бути позитивним числом.", nameof(newQuantity));

            if (Quantity != newQuantity)
            {
                Quantity = newQuantity;
                SetUpdatedAt();
            }
        }

        #endregion
    }
}