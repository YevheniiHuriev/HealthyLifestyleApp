import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

function HomePage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Паролі не збігаються!");
            return;
        }

        try {
            const response = await axios.post(
                // Пізніше можна винести як змінну та використовувати .env
                process.env.REACT_APP_API_URL + "/api/Auth/register",
                { fullName, email, dateOfBirth, gender, weight, height, password, confirmPassword }
            );

            if (response.status === 200) {
                setErrorMessage("");
                navigate("/login");
            }
        } catch (err) {
            if (err.response) {
                setErrorMessage(err.response.data?.Errors?.[0] || "Невідома помилка");
            } else {
                setErrorMessage("Помилка мережі: " + err.message);
            }
        }
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
            <h2>Реєстрація</h2>
            <form onSubmit={handleRegister}>
                <label>Повне ім'я:</label><br />
                <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                /><br /><br />

                <label>Email:</label><br />
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                /><br /><br />

                <label>Дата народження:</label><br />
                <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                /><br /><br />

                <label>Стать:</label><br />
                <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                >
                <option value="">Оберіть стать</option>
                <option value="Male">Чоловіча</option>
                <option value="Female">Жіноча</option>
                <option value="Other">Інша</option>
                </select><br /><br />

                <label>Вага (кг):</label><br />
                <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                required
                /><br /><br />

                <label>Зріст (см):</label><br />
                <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="0"
                required
                /><br /><br />

                <label>Пароль:</label><br />
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                /><br /><br />

                <label>Підтвердження пароля:</label><br />
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                /><br /><br />

                <button type="submit">Зареєструватися</button>
                {errorMessage && <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>}
            </form>
            </div>

    );
}

export default HomePage;