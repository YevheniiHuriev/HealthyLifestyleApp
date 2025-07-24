using HealthyLifestyle.Core.Entities;
using HealthyLifestyle.Core.Interfaces;
using HealthyLifestyle.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HealthyLifestyle.Infrastructure.Repositories
{
    /// <summary>
    /// Базовий репозиторій для роботи з сутностями, що наслідують <see cref="BaseEntity"/>.
    /// Реалізує стандартні CRUD-операції.
    /// </summary>
    /// <typeparam name="TEntity">Тип сутності.</typeparam>
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : BaseEntity
    {
        /// <summary>
        /// Контекст бази даних.
        /// </summary>
        protected readonly ApplicationDbContext _dbContext;

        /// <summary>
        /// Набір сутностей типу <typeparamref name="TEntity"/>.
        /// </summary>
        protected readonly DbSet<TEntity> _dbSet;

        /// <summary>
        /// Створює новий екземпляр репозиторію.
        /// </summary>
        /// <param name="dbContext">Контекст бази даних.</param>
        public Repository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = _dbContext.Set<TEntity>();
        }

        /// <summary>
        /// Асинхронно отримує сутність за вказаним ідентифікатором.
        /// </summary>
        /// <param name="id">Унікальний ідентифікатор сутності.</param>
        /// <returns>Сутність або <c>null</c>, якщо не знайдено.</returns>
        public virtual async Task<TEntity?> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id);
        }

        /// <summary>
        /// Асинхронно отримує всі сутності типу <typeparamref name="TEntity"/>.
        /// </summary>
        /// <returns>Колекція всіх сутностей.</returns>
        public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        /// <summary>
        /// Асинхронно додає нову сутність до контексту відстеження.
        /// </summary>
        /// <param name="entity">Сутність для додавання.</param>
        public virtual async Task AddAsync(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
        }

        /// <summary>
        /// Позначає сутність як змінену для подальшого збереження.
        /// </summary>
        /// <param name="entity">Сутність для оновлення.</param>
        public virtual void Update(TEntity entity)
        {
            _dbSet.Attach(entity);
            _dbContext.Entry(entity).State = EntityState.Modified;
        }

        /// <summary>
        /// Видаляє сутність з контексту відстеження.
        /// </summary>
        /// <param name="entity">Сутність для видалення.</param>
        public virtual void Delete(TEntity entity)
        {
            _dbSet.Remove(entity);
        }

        /// <summary>
        /// Повертає <see cref="IQueryable{TEntity}"/> для побудови складних запитів із застосуванням LINQ.
        /// </summary>
        /// <returns>Об'єкт <see cref="IQueryable{TEntity}"/>.</returns>
        public virtual IQueryable<TEntity> AsQueryable()
        {
            return _dbSet.AsQueryable();
        }
    }
}