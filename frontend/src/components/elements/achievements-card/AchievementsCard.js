import React from 'react';
import './AchievementsCard.css';

const AchievementsCard = ({ activeView, selectedItem, onItemClick, onBackClick }) => {
  const achievements = [
    { 
      id: 1,
      date: "31.08", 
      text: "Тренування", 
      extra: "1 год",
      details: {
        fullDate: "31.08.2025\n17:05 - 18:10",
        message: "Масш успіхи!\nПродуктивний день!\nПройдено тренування 'NOMYFY ST'",
        duration: "1 год 05 хв",
        calories: "175 кКал",
        motivation: "ТІЛЬКИ ВПЕРЕД!"
      }
    },
    { id: 2, date: "11.07", text: "Пройдено марафон..." },
    { id: 3, date: "11.07", text: "Втрата ваги" },
    { id: 4, date: "11.07", text: "Ти молодець!" },
    { id: 5, date: "11.07", text: "Ти молодець!" },
  ];

  const renderAchievementsList = () => (
    <div className="list">
      {achievements.map((a, i) => (
        <div key={i} className="list-item" onClick={() => onItemClick('achievements', a)}>
          <span className="date">{a.date}</span>
          <span className="text">{a.text}</span>
          {a.extra && <span className="extra">{a.extra}</span>}
          <span className="dots">•••</span>
        </div>
      ))}
    </div>
  );

  const renderAchievementDetails = () => (
    <div className="details-view">
      <div className="details-header">
        <button className="back-button" onClick={() => onBackClick('achievements')}>
          ←
        </button>
        <h4>Деталі успіху</h4>
      </div>
      <div className="details-content">
        <div className="detail-date">{selectedItem.details.fullDate}</div>
        <div className="detail-message">{selectedItem.details.message}</div>
        <div className="detail-stats">
          <div className="stat">
            <span className="stat-label">Тривалість</span>
            <span className="stat-value">{selectedItem.details.duration}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Спалено</span>
            <span className="stat-value">{selectedItem.details.calories}</span>
          </div>
        </div>
        <div className="detail-motivation">{selectedItem.details.motivation}</div>
      </div>
    </div>
  );

  return (
    <div className="achievements card">
      <h3>Твої успіхи</h3>
      {activeView === 'list' ? renderAchievementsList() : renderAchievementDetails()}
    </div>
  );
};

export default AchievementsCard;