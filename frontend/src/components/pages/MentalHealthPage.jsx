// import MentalMainContent from '../elements/Health/MentalHealth/elements/MentalHealthMain/MentalHealthMain';
// import EmotionDiary from '../elements/Health/MentalHealth/elements/EmotionDiary/EmotionDiary';

const MentalHealthPage = () => {
    <div className="mental-health-container">
        <div className="mental-health-content">
            <div className="mental-health-info">
                <div className="title">Твій спокій починається тут.</div>
                <div className="sub-title">Ми зібрали інструменти, які допоможуть залишитись врівноваженим навіть у найстресовіші дні.</div>
                <div className="image"></div>
            </div>
            <div className="mental-health-card-link">
                <div className="m-card-link">
                <div className="image"></div>
                <div className="title">Щоденник емоцій</div>
                <div className="option-link">
                    <button className="option-link-btn">Почати</button>
                </div>
                </div>
                <div className="m-card-link">
                    <div className="image"></div>
                    <div className="title">Тести на стан</div>
                    <div className="option-link">
                        <button className="option-link-btn">Пройти тест</button>
                    </div>
                </div>
                <div className="m-card-link">
                    <div className="image"></div>
                    <div className="title">Дихальні практики</div>
                    <div className="option-link">
                        <button className="option-link-btn">Обрати практику</button>
                    </div>
                </div>
                <div className="m-card-link">
                    <div className="image"></div>
                    <div className="title">Корисні статті</div>
                    <div className="option-link">
                        <button className="option-link-btn">Переглянути статті</button>
                    </div>
                </div>
            </div>
            <div>
                <button className="specialist-btn">
                    Звернутись до спеціаліста
                </button>
            </div>
        </div>
    </div>
}

export default MentalHealthPage;