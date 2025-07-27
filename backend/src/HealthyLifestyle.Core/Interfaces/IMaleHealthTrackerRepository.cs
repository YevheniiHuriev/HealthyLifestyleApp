using HealthyLifestyle.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthyLifestyle.Core.Interfaces
{
    /// <summary>
    /// Спеціалізований інтерфейс репозиторію для сутності MaleHealthTracker.
    /// Розширює загальний IRepository, надаючи специфічні операції для чоловічого трекера здоровя.
    /// </summary>
    public interface IMaleHealthTrackerRepository : IRepository<MaleHealthTracker>
    {
        // Приклад: Якщо вам знадобиться специфічний для MaleHealthTracker метод,
        // який не є загальним CRUD, ви можете додати його сюди.
    }
}
