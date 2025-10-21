import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { ru } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchForm.css";

import locationIcon from "../../assets/images/Vector.png";
import arrowIcon from "../../assets/images/arrow.png";
import calendar from "../../assets/images/Group.png";

const SearchForm = () => {
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    departureDate: null,
    returnDate: null,
  });

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDepartureDateChange = (date) => {
    setSearchData({
      ...searchData,
      departureDate: date,
      returnDate:
        searchData.returnDate && date && searchData.returnDate < date
          ? null
          : searchData.returnDate,
    });
  };

  const handleReturnDateChange = (date) => {
    setSearchData({
      ...searchData,
      returnDate: date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search data:", searchData);
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-grid">
        {/* Секция направления с иконкой между полями */}
        <div className="direction-section">
          <span className="section-label direction-label">Направление</span>
          <div className="direction-fields-with-icon">
            <div className="form-group with-icon">
              <input
                type="text"
                id="from"
                name="from"
                value={searchData.from}
                onChange={handleChange}
                placeholder="Откуда"
                className="form-input"
                required
              />
              <img src={locationIcon} alt="Location" className="input-icon" />
            </div>

            {/* Иконка между полями "Откуда" и "Куда" */}
            <div className="direction-icon-container">
              <img
                src={arrowIcon}
                alt="Arrow"
                className="direction-arrow-icon"
              />
            </div>

            <div className="form-group with-icon">
              <input
                type="text"
                id="to"
                name="to"
                value={searchData.to}
                onChange={handleChange}
                placeholder="Куда"
                className="form-input"
                required
              />
              <img src={locationIcon} alt="Location" className="input-icon" />
            </div>
          </div>
        </div>

        {/* Секция дат */}
        <div className="date-section">
          <span className="section-label date-label">Дата</span>
          <div className="date-fields">
            <div className="form-group">
              <DatePicker
                selected={searchData.departureDate}
                onChange={handleDepartureDateChange}
                minDate={minDate}
                maxDate={maxDate}
                locale={ru}
                dateFormat="dd.MM.yyyy"
                placeholderText="Туда"
                className="date-picker-input"
                required
                isClearable
                clearButtonTitle="Очистить"
                showPopperArrow={false}
              />
              <img src={calendar} alt="Calendar" className="input-icon" />
            </div>
            <div className="form-group">
              <DatePicker
                selected={searchData.returnDate}
                onChange={handleReturnDateChange}
                minDate={searchData.departureDate || minDate}
                maxDate={maxDate}
                locale={ru}
                dateFormat="dd.MM.yyyy"
                placeholderText="Обратно"
                className="date-picker-input"
                isClearable
                clearButtonTitle="Очистить"
                showPopperArrow={false}
              />
              <img src={calendar} alt="Calendar" className="input-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="search-button">
          НАЙТИ БИЛЕТЫ
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
