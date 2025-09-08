// import React from 'react';
// import './DataCard.css';

// const DataCard = ({ 
//   title, 
//   data, 
//   activeView, 
//   selectedItem, 
//   onItemClick, 
//   onBackClick,
//   type 
// }) => {
//   // Функція для рендерингу списку елементів
//   const renderList = () => (
//     <div className="list">
//       {data.map((item, index) => (
//         <div 
//           key={item.id || index} 
//           className="list-item" 
//           onClick={() => onItemClick(type, item)}
//         >
//           <span className="date">{item.date}</span>
//           <span className="text">{item.text}</span>
//           {item.extra && <span className="extra">{item.extra}</span>}
//           <span className="dots">•••</span>
//         </div>
//       ))}
//     </div>
//   );

//   // Функція для рендерингу деталей успіху
//   const renderAchievementDetails = () => (
//     <div className="details-view">
//       <div className="details-header">
//         <button className="back-button" onClick={() => onBackClick(type)}>
//           ←
//         </button>
//         <h4>Деталі успіху</h4>
//       </div>
//       <div className="details-content">
//         <div className="detail-date">{selectedItem.details?.fullDate}</div>
//         <div className="detail-message">{selectedItem.details?.message}</div>
//         <div className="detail-stats">
//           <div className="stat">
//             <span className="stat-label">Тривалість</span>
//             <span className="stat-value">{selectedItem.details?.duration}</span>
//           </div>
//           <div className="stat">
//             <span className="stat-label">Спалено</span>
//             <span className="stat-value">{selectedItem.details?.calories}</span>
//           </div>
//         </div>
//         <div className="detail-motivation">{selectedItem.details?.motivation}</div>
//       </div>
//     </div>
//   );

//   // Функція для рендерингу деталей покупки
//   const renderPurchaseDetails = () => (
//     <div className="details-view">
//       <div className="details-header">
//         <button className="back-button" onClick={() => onBackClick(type)}>
//           ←
//         </button>
//         <h4>Деталі покупки</h4>
//       </div>
//       <div className="details-content">
//         <div className="purchase-info">
//           <div className="purchase-date">{selectedItem.date}</div>
//           <div className="purchase-title">{selectedItem.text}</div>
//           <div className="purchase-status">Статус: Доставлено</div>
//           <div className="purchase-tracking">Трек номер: NMF-{selectedItem.id}247</div>
//         </div>
//       </div>
//     </div>
//   );

//   // Вибір відповідної функції рендерингу деталей залежно від типу
//   const renderDetails = () => {
//     if (type === 'achievements') {
//       return renderAchievementDetails();
//     } else if (type === 'purchases') {
//       return renderPurchaseDetails();
//     }
//     return null;
//   };

//   return (
//     <div className={`data-card card ${type}`}>
//       <h3>{title}</h3>
//       {activeView === 'list' ? renderList() : renderDetails()}
//     </div>
//   );
// };

// export default DataCard;

// import React from 'react';
// import './DataCard.css';

// const DataCard = ({ 
//   title, 
//   data, 
//   activeView, 
//   selectedItem, 
//   onItemClick, 
//   onBackClick,
//   type 
// }) => {
//   // Функція для рендерингу списку елементів
//   const renderList = () => (
//     <div className="list">
//       {data.map((item, index) => (
//         <div 
//           key={item.id || index} 
//           className="list-item" 
//           onClick={() => onItemClick(type, item)}
//         >
//           <span className="date">{item.date}</span>
//           <span className="text">{item.text}</span>
//           {item.extra && <span className="extra">{item.extra}</span>}
//           <span className="dots">•••</span>
//         </div>
//       ))}
//     </div>
//   );

//   // Функція для рендерингу деталей успіху
//   const renderAchievementDetails = () => (
//     <div className="details-view">
//       <div className="details-header">
//         <button className="back-button" onClick={() => onBackClick(type)}>
//           ←
//         </button>
//         <h4>Деталі успіху</h4>
//       </div>
//       <div className="details-content">
//         <div className="detail-date">{selectedItem.details?.fullDate}</div>
//         <div className="detail-message">{selectedItem.details?.message}</div>
//         <div className="detail-stats">
//           <div className="stat">
//             <span className="stat-label">Тривалість</span>
//             <span className="stat-value">{selectedItem.details?.duration}</span>
//           </div>
//           <div className="stat">
//             <span className="stat-label">Спалено</span>
//             <span className="stat-value">{selectedItem.details?.calories}</span>
//           </div>
//         </div>
//         <div className="detail-motivation">{selectedItem.details?.motivation}</div>
//       </div>
//     </div>
//   );

//   // Функція для рендерингу деталей покупки
//   const renderPurchaseDetails = () => (
//     <div className="details-view">
//       <div className="details-header">
//         <button className="back-button" onClick={() => onBackClick(type)}>
//           ←
//         </button>
//         <h4>Деталі покупки</h4>
//       </div>
//       <div className="details-content">
//         <div className="purchase-info">
//           <div className="purchase-date">{selectedItem.date}</div>
//           <div className="purchase-title">{selectedItem.text}</div>
//           <div className="purchase-status">Статус: Доставлено</div>
//           <div className="purchase-tracking">Трек номер: NMF-{selectedItem.id}247</div>
//         </div>
//       </div>
//     </div>
//   );

//   // Вибір відповідної функції рендерингу деталей залежно від типу
//   const renderDetails = () => {
//     if (type === 'achievements') {
//       return renderAchievementDetails();
//     } else if (type === 'purchases') {
//       return renderPurchaseDetails();
//     }
//     return null;
//   };

//   return (
//     <div className={`data-card card ${type}`}>
//       <h3>{title}</h3>
//       {activeView === 'list' ? renderList() : renderDetails()}
//     </div>
//   );
// };

// export default DataCard;

import React from 'react';
import './DataCard.css';

const DataCard = ({ 
  title, 
  data, 
  activeView, 
  selectedItem, 
  onItemClick, 
  onBackClick,
  type 
}) => {
  // Дані за замовчуванням, якщо не передані через props
  const defaultAchievements = [
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

  const defaultPurchases = [
    { id: 1, date: "31.08", text: "Футболка Nomy" },
    { id: 2, date: "11.07", text: "Підписка на тренування" },
    { id: 3, date: "11.07", text: "Футболка Nomy" },
    { id: 4, date: "11.07", text: "Футболка Nomy" },
    { id: 5, date: "11.07", text: "Футболка Nomy" },
    { id: 6, date: "11.07", text: "Футболка Nomy" },
  ];

  // Використовуємо передані дані або дані за замовчуванням
  const displayData = data || (type === 'achievements' ? defaultAchievements : defaultPurchases);

  // Визначаємо, чи картка відкрита (детальний перегляд)
  const isCardOpen = activeView === 'details';

  // Функція для рендерингу списку елементів
  const renderList = () => (
    <div className="list">
      {displayData.map((item, index) => (
        <div 
          key={item.id || index} 
          className="list-item" 
          onClick={() => onItemClick(type, item)}
        >
          <span className="date">{item.date}</span>
          <span className="text">{item.text}</span>
          {item.extra && <span className="extra">{item.extra}</span>}
          <span className="dots">•••</span>
        </div>
      ))}
    </div>
  );

  // Функція для рендерингу деталей успіху
  const renderAchievementDetails = () => (
    <div className="details-view">
      <div className="details-header">
        <button className="back-button" onClick={() => onBackClick(type)}>
          ←
        </button>
        <h4>Деталі успіху</h4>
      </div>
      <div className="details-content">
        <div className="detail-date">{selectedItem.details?.fullDate}</div>
        <div className="detail-message">{selectedItem.details?.message}</div>
        <div className="detail-stats">
          <div className="stat">
            <span className="stat-label">Тривалість</span>
            <span className="stat-value">{selectedItem.details?.duration}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Спалено</span>
            <span className="stat-value">{selectedItem.details?.calories}</span>
          </div>
        </div>
        <div className="detail-motivation">{selectedItem.details?.motivation}</div>
      </div>
    </div>
  );

  const renderPurchaseDetails = () => (
    <div className="details-view">
      <div className="details-header">
        <button className="back-button" onClick={() => onBackClick(type)}>
          ←
        </button>
        <h4>Деталі покупки</h4>
      </div>
      <div className="details-content">
        <div className="purchase-info">
          <div className="purchase-date">{selectedItem.date}</div>
          <div className="purchase-title">{selectedItem.text}</div>
          <div className="purchase-status">Статус: Доставлено</div>
          <div className="purchase-tracking">Трек номер: NMF-{selectedItem.id}247</div>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => {
    if (type === 'achievements') {
      return renderAchievementDetails();
    } else if (type === 'purchases') {
      return renderPurchaseDetails();
    }
    return null;
  };

  return (
    <div className={`data-card card ${type} ${isCardOpen ? 'card-open' : 'card-closed'}`}>
      <h3>{title}</h3>
      {activeView === 'list' ? renderList() : renderDetails()}
    </div>
  );
};

export default DataCard;