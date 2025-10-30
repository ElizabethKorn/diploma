import React, { useState } from "react";

const CoachTypeBlock = ({ coach, isLast, onSelect }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const formatPrice = (price) => {
    if (!price || price === Infinity) return "--";
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  return (
    <div
      className={`coach-type-block ${isLast ? "last" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
    >
      <div className="coach-type-content">
        <div className="coach-type-row">
          <span className="coach-type-name">{coach.name}</span>
          <span className="coach-seats">{coach.seats}</span>
          <div className="coach-price">
            <span className="price-from">от</span>
            <span className="price-amount">{formatPrice(coach.price)}</span>
            <span className="price-currency">₽</span>
          </div>
        </div>
      </div>

      {showTooltip && (
        <div className="coach-tooltip">
          <div className="tooltip-content">
            {/* Для плацкарта показываем боковые места */}
            {coach.type === "platzkart" ? (
              <>
                <div className="seat-info">
                  <span>Верхние</span>
                  <span>{coach.topSeats}</span>
                  <span>{formatPrice(coach.topPrice)} ₽</span>
                </div>
                <div className="seat-info">
                  <span>Нижние</span>
                  <span>{coach.bottomSeats}</span>
                  <span>{formatPrice(coach.bottomPrice)} ₽</span>
                </div>
                <div className="seat-info">
                  <span>Боковые</span>
                  <span>{coach.sideSeats}</span>
                  <span>{formatPrice(coach.sidePrice)} ₽</span>
                </div>
              </>
            ) : (
              <>
                <div className="seat-info">
                  <span>Верхние</span>
                  <span>{coach.topSeats}</span>
                  <span>{formatPrice(coach.topPrice)} ₽</span>
                </div>
                <div className="seat-info">
                  <span>Нижние</span>
                  <span>{coach.bottomSeats}</span>
                  <span>{formatPrice(coach.bottomPrice)} ₽</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachTypeBlock;
