import React from "react";

const MentalHealthCard = ({ image, title, buttonText, onButtonClick }) => {
    return (
        <div className="m-card-link">
            <div className="image">{image}</div>
            <div className="title">{title}</div>
            <div className="option-link">
                <button className="option-link-btn" onClick={onButtonClick}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default MentalHealthCard;