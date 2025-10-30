import React, { useState, useEffect } from "react";
import { ticketApiService, formatUtils } from "../../services/ticketApiService";
import "./LastTickets.css";
import trainImage from "../../assets/images/pic.png";

const LastTickets = () => {
  const [lastTickets, setLastTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLastTickets();
  }, []);

  const fetchLastTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketApiService.getLastTickets();
      setLastTickets(data);
    } catch (error) {
      console.error("Error fetching last tickets:", error);
      setLastTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const getSafeData = (obj, path, defaultValue = "") => {
    return (
      path.split(".").reduce((acc, part) => acc && acc[part], obj) ||
      defaultValue
    );
  };

  const formatStationName = (stationName) => {
    if (!stationName) return "";
    return `${stationName} вокзал`;
  };

  return (
    <div className="last-tickets-container">
      <h3 className="last-tickets-heading">ПОСЛЕДНИЕ БИЛЕТЫ</h3>
      <div className="last-tickets-items">
        {loading ? (
          <div className="last-tickets-loading">Загрузка...</div>
        ) : lastTickets.length > 0 ? (
          lastTickets.map((ticket, index) => (
            <div key={index} className="last-ticket-item">
              <div className="last-ticket-content">
                <div className="last-ticket-route">
                  <div className="last-ticket-section">
                    <div className="last-ticket-city">
                      {formatUtils.formatCityName(
                        getSafeData(ticket, "from.city.name")
                      )}
                    </div>
                    <div className="last-ticket-station">
                      {formatStationName(
                        getSafeData(ticket, "from.railway_station.name")
                      )}
                    </div>
                  </div>
                  <div className="last-ticket-section">
                    <div className="last-ticket-city">
                      {formatUtils.formatCityName(
                        getSafeData(ticket, "to.city.name")
                      )}
                    </div>
                    <div className="last-ticket-station">
                      {formatStationName(
                        getSafeData(ticket, "to.railway_station.name")
                      )}
                    </div>
                  </div>
                </div>
                <div className="last-ticket-bottom">
                  <div className="last-ticket-image">
                    <img src={trainImage} alt="Поезд" />
                  </div>
                  <div className="last-ticket-price">
                    <span className="last-ticket-price-prefix">от</span>
                    <span className="last-ticket-price-value">
                      {formatUtils.formatPrice(ticket.min_price)}
                    </span>
                    <span className="last-ticket-price-currency">₽</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="last-tickets-empty">
            Нет данных о последних билетах
          </div>
        )}
      </div>
    </div>
  );
};

export default LastTickets;
