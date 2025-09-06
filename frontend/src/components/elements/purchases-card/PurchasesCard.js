import React from 'react';
import './PurchasesCard.css';

const PurchasesCard = ({ activeView, selectedItem, onItemClick, onBackClick }) => {
  const purchases = [
    { id: 1, date: "31.08", text: "Футболка Nomy" },
    { id: 2, date: "11.07", text: "Підписка на тренування" },
    { id: 3, date: "11.07", text: "Футболка Nomy" },
    { id: 4, date: "11.07", text: "Футболка Nomy" },
    { id: 5, date: "11.07", text: "Футболка Nomy" },
    { id: 6, date: "11.07", text: "Футболка Nomy" },
  ];

  const renderPurchasesList = () => (
    <div className="list">
      {purchases.map((p, i) => (
        <div key={i} className="list-item" onClick={() => onItemClick('purchases', p)}>
          <span className="date">{p.date}</span>
          <span className="text">{p.text}</span>
          <span className="dots">•••</span>
        </div>
      ))}
    </div>
  );

  const renderPurchaseDetails = () => (
    <div className="details-view">
      <div className="details-header">
        <button className="back-button" onClick={() => onBackClick('purchases')}>
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

  return (
    <div className="purchases card">
      <h3>Твої покупки</h3>
      {activeView === 'list' ? renderPurchasesList() : renderPurchaseDetails()}
    </div>
  );
};

export default PurchasesCard;