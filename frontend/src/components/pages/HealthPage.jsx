// import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";

const HealthPage = (children) => {
    return (
        <div className="health-container">
            <div className="current-health-link">
            <span>Головна </span>
            <span>&#62;</span>
            <span> Здоров'я </span>
            <span>&#62;</span>
            <span> Ментальне здоров'я</span>
            </div>
            <div className="health-links">
                <button className="health-link-btn">Твоє здоров'я</button>
                <button className="health-link-btn">Ментальне здоров'я</button>
                <button className="health-link-btn">Здоров'я за статтю</button>
            </div>
            <div className="health-content">
                {children}
            </div>
        </div>
    );
};

export default HealthPage;
