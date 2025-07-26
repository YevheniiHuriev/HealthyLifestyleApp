using HealthyLifestyle.Core.Entities;
using HealthyLifestyle.Core.Interfaces;
using HealthyLifestyle.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthyLifestyle.Infrastructure.Repositories
{
    /// <summary>
    /// Реалізація репозиторію для сутності Product.
    /// Успадковує базові CRUD-операції від Repository<Product>.
    /// </summary>
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        /// <summary>
        /// Створює новий екземпляр ProductRepository.
        /// </summary>
        /// <param name="dbContext">Контекст бази даних.</param>
        public ProductRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            // Базовий конструктор Repository<Product> вже ініціалізує _dbContext та _dbSet.
        }

        // Якщо ви додали специфічні методи до IProductRepository, їх реалізація буде тут.
        // Наприклад:
        // public async Task<IReadOnlyList<Product>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        // {
        //     return await _dbSet.Where(p => p.Price >= minPrice && p.Price <= maxPrice).ToListAsync();
        // }

        // public async Task<Product?> GetProductByNameAsync(string productName)
        // {
        //     return await _dbSet.FirstOrDefaultAsync(p => p.Name == productName);
        // }
    }
}
