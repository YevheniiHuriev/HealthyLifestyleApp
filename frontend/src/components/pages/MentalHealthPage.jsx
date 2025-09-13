import React from "react";
import MentalHealthCard from "../elements/Health/MentalHealth/MentalHealthCardLink/MentalHealthCardLink"; // Шлях до вашого компонента

const MentalHealthPage = () => {
    
    const handleEmotionDiary = () => {
        console.log("Перехід до щоденника емоцій");
        // Тут можна додати навігацію або іншу логіку
    };

    const handleTests = () => {
        console.log("Перехід до тестів");
    };

    const handleBreathing = () => {
        console.log("Перехід до дихальних практик");
    };

    const handleArticles = () => {
        console.log("Перехід до статей");
    };

    return (
        <div className="mental-health-container">
            <div className="mental-health-content">
                <div className="mental-health-info">
                    <div className="title">Твій спокій починається тут.</div>
                    <div className="sub-title">Ми зібрали інструменти, які допоможуть залишитись врівноваженим навіть у найстресовіші дні.</div>
                    <div className="image"></div>
                </div>
                <div className="mental-health-card-link">
                    <MentalHealthCard
                        image={<div className="card-image">📝</div>}
                        title="Щоденник емоцій"
                        buttonText="Почати"
                        onButtonClick={handleEmotionDiary}
                    />
                    <MentalHealthCard
                        image={<div className="card-image">🧪</div>}
                        title="Тести на стан"
                        buttonText="Пройти тест"
                        onButtonClick={handleTests}
                    />
                    <MentalHealthCard
                        image={<div className="card-image">🌬️</div>}
                        title="Дихальні практики"
                        buttonText="Обрати практику"
                        onButtonClick={handleBreathing}
                    />
                    <MentalHealthCard
                        image={<div className="card-image">📚</div>}
                        title="Корисні статті"
                        buttonText="Переглянути статті"
                        onButtonClick={handleArticles}
                    />
                </div>
                <div>
                    <button className="specialist-btn">
                        Звернутись до спеціаліста
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MentalHealthPage;