import React from "react";
import "./TicketCard.css";
import yellowArrow from "../../assets/images/yellowArrow.png";
import trainIcon from "../../assets/images/train.png";
import CoachTypeBlock from "./CoachTypeBlock";
import features from "../../assets/images/pic.png";
import { coachUtils, formatUtils } from "../../services/ticketApiService";

const TicketCard = ({ route, onSelectSeats, searchParams }) => {
  const { formatTime, formatDuration, formatCityName } = formatUtils;

  // Функция для построения маршрута с промежуточными городами
  const getRoutePath = () => {
    const departure = route.departure || route;
    const searchFrom = searchParams?.from?.toLowerCase();
    const actualFrom = departure.from?.city?.name?.toLowerCase();

    // Если поезд идет из точно указанного города
    if (searchFrom && actualFrom && actualFrom.includes(searchFrom)) {
      return (
        <>
          <span className="city main">
            {formatCityName(departure.from?.city?.name) || "Город отправления"}
          </span>
          <span className="arrow">→</span>
          <span className="city main destination">
            {formatCityName(departure.to?.city?.name) || "Город прибытия"}
          </span>
        </>
      );
    }

    // Если поезд идет через промежуточные города
    return (
      <>
        <span className="city intermediate">
          {formatCityName(departure.from?.city?.name) || "Адлер"}
        </span>
        <span className="arrow">→</span>
        <span className="city main">
          {formatCityName(searchParams?.to) ||
            formatCityName(departure.to?.city?.name)}
        </span>
        <span className="arrow">→</span>
        <span className="city main destination">
          {formatCityName(departure.to?.city?.name) || "Санкт-Петербург"}
        </span>
      </>
    );
  };

  const departure = route.departure || route;
  const arrival = route.arrival;
  const availableCoaches = coachUtils.getAvailableCoachTypes(departure);

  return (
    <div className="ticket-card">
      {/* Левая часть*/}
      <div className="ticket-left">
        <div className="train-icon-container">
          <img src={trainIcon} alt="Поезд" className="train-icon" />
        </div>
        <div className="train-info">
          <div className="train-number">{departure.train?.name}</div>
          <div className="route-path">{getRoutePath()}</div>
        </div>
      </div>

      {/* Центральная часть*/}
      <div className="ticket-center">
        {/* Рейс туда */}
        <div className="time-section">
          <div className="time-departure">
            <div className="time-large">
              {formatTime(departure.from?.datetime)}
            </div>
            <div className="station-info">
              <div className="station-name">
                {formatCityName(departure.from?.city?.name)}
              </div>
              <div className="station-detail">
                {departure.from?.railway_station_name + " вокзал"}
              </div>
            </div>
          </div>

          <div className="duration">
            <div className="duration-text">
              {formatDuration(departure.duration)}
            </div>
            <img src={yellowArrow} alt="Туда" className="direction-arrow" />
          </div>

          <div className="time-arrival">
            <div className="time-large">
              {formatTime(departure.to?.datetime)}
            </div>
            <div className="station-info">
              <div className="station-name">
                {formatCityName(departure.to?.city?.name)}
              </div>
              <div className="station-detail">
                {departure.to?.railway_station_name + " вокзал"}
              </div>
            </div>
          </div>
        </div>

        {/* Обратный рейс (если есть) */}
        {arrival && (
          <>
            <div className="time-section">
              <div className="time-departure">
                <div className="time-large">
                  {formatTime(arrival.from?.datetime)}
                </div>
                <div className="station-info">
                  <div className="station-name">
                    {formatCityName(arrival.to?.city?.name)}
                  </div>
                  <div className="station-detail">
                    {arrival.to?.railway_station_name + " вокзал"}
                  </div>
                </div>
              </div>

              <div className="duration">
                <div className="duration-text">
                  {formatDuration(arrival.duration)}
                </div>
                <img
                  src={yellowArrow}
                  alt="Обратно"
                  className="direction-arrow reverse"
                />
              </div>

              <div className="time-arrival">
                <div className="time-large">
                  {formatTime(arrival.to?.datetime)}
                </div>
                <div className="station-info">
                  <div className="station-name">
                    {formatCityName(arrival.from?.city?.name)}
                  </div>
                  <div className="station-detail">
                    {arrival.from?.railway_station_name + " вокзал"}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Правая часть */}
      <div className="ticket-right">
        <div className="coach-types-grid">
          {availableCoaches.map((coach, index) => (
            <CoachTypeBlock
              key={coach.type}
              coach={coach}
              isLast={index === availableCoaches.length - 1}
              onSelect={() =>
                onSelectSeats(route._id || departure._id, coach.type)
              }
            />
          ))}
        </div>

        <div className="coach-features-global">
          <img
            src={features}
            alt="Характеристики поезда"
            className="global-feature-image"
            title="Поезд оснащен Wi-Fi, кондиционером и является экспрессом"
          />
        </div>

        <button
          className="select-seats-button"
          onClick={() =>
            onSelectSeats(route._id || departure._id, availableCoaches[0]?.type)
          }
          disabled={availableCoaches.length === 0}
        >
          Выбрать места
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
