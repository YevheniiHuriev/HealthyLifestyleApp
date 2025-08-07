import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

function HomePage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    // Можливо, варто хешувати пароль на стороні фронтенду, а не бекенду
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                // Пізніше можна винести як змінну та використовувати .env
                process.env.REACT_APP_API_URL + "/api/Auth/login",
                { email, password }
            );
            if (response.data.Token) {
                localStorage.setItem("helth-token", response.data.Token); // Зберігання токену
                // Також можна отримати та зберігти інші дані, що прийшли з сервера
                navigate("/userpage");
            }
        } catch (err) {
            console.log("Помилка авторизації: ", err);
        }
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
            <h2>Вхід</h2>
            <form onSubmit={handleLogin}>
                <label>Email:</label><br />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br /><br />

                <label>Пароль:</label><br />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br /><br />

                <button type="submit">Увійти</button>
                <button onClick={() => navigate("/register")}>Реестрація</button>
            </form>
        </div>
    );
}

export default HomePage;