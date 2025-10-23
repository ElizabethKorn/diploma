import DatePicker from "react-datepicker";
import { ru } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchForm.css";

import { useSearchForm } from "../../hooks/useSearchForm";

import locationIcon from "../../assets/images/location.png";
import arrowIcon from "../../assets/images/arrow.png";
import calendar from "../../assets/images/calendar.png";

const SearchForm = ({ className = "" }) => {
  const {
    searchData,
    suggestions,
    focusedField,
    fromInputRef,
    toInputRef,
    handleInputChange,
    handleFocus,
    handleBlur,
    handleSuggestionClick,
    handleDepartureDateChange,
    handleReturnDateChange,
    handleSubmit,
  } = useSearchForm();

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const renderDayContents = (day, date) => {
    const dayOfWeek = date.getDay();
    const isSunday = dayOfWeek === 0;

    return (
      <div
        style={{
          fontWeight: isSunday ? "bold" : "normal",
          color: isSunday ? "#000" : "inherit",
        }}
      >
        {day}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`search-form ${className}`.trim()}>
      <div className="form-grid">
        <div className="direction-section">
          <span className="section-label direction-label">Направление</span>
          <div className="direction-fields-with-icon">
            <div
              className="form-group with-icon autocomplete-container"
              ref={fromInputRef}
            >
              <input
                type="text"
                id="from"
                name="from"
                value={searchData.from}
                onChange={handleInputChange}
                onFocus={() => handleFocus("from")}
                onBlur={handleBlur}
                placeholder="Откуда"
                className="form-input"
                required
                autoComplete="off"
              />
              <img src={locationIcon} alt="Location" className="input-icon" />

              {suggestions.from.length > 0 && focusedField === "from" && (
                <div className="suggestions-list">
                  {suggestions.from.map((city) => (
                    <div
                      key={city.id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick("from", city)}
                    >
                      {city.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="direction-icon-container">
              <img
                src={arrowIcon}
                alt="Arrow"
                className="direction-arrow-icon"
              />
            </div>

            <div
              className="form-group with-icon autocomplete-container"
              ref={toInputRef}
            >
              <input
                type="text"
                id="to"
                name="to"
                value={searchData.to}
                onChange={handleInputChange}
                onFocus={() => handleFocus("to")}
                onBlur={handleBlur}
                placeholder="Куда"
                className="form-input"
                required
                autoComplete="off"
              />
              <img src={locationIcon} alt="Location" className="input-icon" />

              {suggestions.to.length > 0 && focusedField === "to" && (
                <div className="suggestions-list">
                  {suggestions.to.map((city) => (
                    <div
                      key={city.id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick("to", city)}
                    >
                      {city.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

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
                clearButtonTitle="Очистить"
                showPopperArrow={false}
                renderDayContents={renderDayContents}
                calendarClassName="custom-calendar"
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
                clearButtonTitle="Очистить"
                showPopperArrow={false}
                renderDayContents={renderDayContents}
                calendarClassName="custom-calendar"
                required
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
