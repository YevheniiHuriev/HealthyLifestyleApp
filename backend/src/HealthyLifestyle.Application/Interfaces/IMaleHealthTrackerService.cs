using HealthyLifestyle.Application.DTOs.Tracker;
using HealthyLifestyle.Application.DTOs.Working;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthyLifestyle.Application.Interfaces
{
    public interface IMaleHealthTrackerService
    {
        /// <summary>
        /// Отримує список усіх записів чоловічого трекера здоров’я.
        /// </summary>
        /// <returns>Список записів чоловічого трекера здоров’я.</returns>
        Task<IEnumerable<MaleHealthTrackerDto>> GetAllMaleHealthTrackeAsync();

        /// <summary>
        /// Отримує запис чоловічого трекера за ідентифікатором.
        /// </summary>
        /// <param name="id">Ідентифікатор запису UserId.</param>
        /// <returns>Запис чоловічого трекера.</returns>
        Task<MaleHealthTrackerDto> GetMaleHealthTrackeByIdAsync(Guid id);

        /// <summary>
        /// Створює новий запис чоловічого трекера.
        /// </summary>
        /// <param name="createDto">Дані для створення запису.</param>
        /// <returns>Створений запис.</returns>
        Task<MaleHealthTrackerDto> CreateMaleHealthTrackeAsync(MaleHealthTrackerCreateDto createDto);

        /// <summary>
        /// Оновлює існуючий запис чоловічого трекера.
        /// </summary>
        /// <param name="id">Ідентифікатор запису.</param>
        /// <param name="updateDto">Оновлені дані.</param>
        /// <returns>Оновлений запис.</returns>
        Task<MaleHealthTrackerDto> UpdateMaleHealthTrackeAsync(Guid id, MaleHealthTrackerUpdateDto updateDto);

        /// <summary>
        /// Видаляє запис чоловічого трекера.
        /// </summary>
        /// <param name="id">Ідентифікатор запису для видалення.</param>
        Task DeleteMaleHealthTrackeAsync(Guid id);
    }
}
