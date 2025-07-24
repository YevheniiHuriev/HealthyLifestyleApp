using System.ComponentModel.DataAnnotations;

namespace HealthyLifestyle.Application.DTOs.Auth
{
    /// <summary>
    /// DTO для передачі даних при вході користувача в систему.
    /// Містить обов’язкові поля Email і Password.
    /// Використовується для автентифікації користувача.
    /// </summary>
    public class LoginUserDto
    {
        /// <summary>
        /// Електронна пошта користувача.
        /// Обов’язкове поле, перевіряється формат електронної пошти.
        /// </summary>
        [Required(ErrorMessage = "Електронна пошта є обов’язковою для заповнення.")]
        [EmailAddress(ErrorMessage = "Невірний формат електронної пошти.")]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Пароль користувача.
        /// Обов’язкове поле, тип даних — пароль (для приховання введення в UI).
        /// </summary>
        [Required(ErrorMessage = "Пароль є обов’язковим для заповнення.")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
    }
}